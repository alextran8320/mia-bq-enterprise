import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  ExternalLink,
  ListTree,
  MessageSquareText,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import { BQ_PROMPT_CHIPS } from "@/mocks/ai-workspace/internalChat";
import {
  aiChatApi,
  type ChatMessage,
  type ChatSession,
} from "@/shared/api/aiChatApi";
import { getApiErrorMessage } from "@/shared/auth/apiClient";
import { MarkdownAnswer } from "../components/MarkdownAnswer";
import { extractSources, type ExtractedSources } from "../lib/extractSources";
import { parseSuggestions } from "../lib/parseSuggestions";

const PROMPT_CHIPS = BQ_PROMPT_CHIPS;
const SUPPORT_ACTIONS = [
  {
    label: "Tra cứu tồn kho theo mã SKU",
    prompt: "Mã BQ-2301 size 40 màu đen còn bao nhiêu tại kho Hà Nội?",
  },
  {
    label: "Kiểm tra trạng thái đơn hàng",
    prompt: "Đơn hàng #98765 đang ở trạng thái nào?",
  },
  {
    label: "Giá bán lẻ sản phẩm",
    prompt: "Giá bán lẻ hiện tại của mã BQ-1102 là bao nhiêu?",
  },
  {
    label: "Chính sách đổi trả và bảo hành",
    prompt: "Chính sách bảo hành giày da cao cấp là bao nhiêu tháng?",
  },
  {
    label: "SOP kiểm kho cuối ngày",
    prompt: "Quy trình kiểm kho cuối ngày là gì?",
  },
  {
    label: "CTKM và khuyến mãi đang chạy",
    prompt: "CTKM tháng 4 cho dòng giày thể thao là gì và còn hàng không?",
  },
  {
    label: "Chiết khấu đại lý Q2/2026",
    prompt: "Đại lý cấp 1 được chiết khấu bao nhiêu trong Q2/2026?",
  },
];

const ASSISTANT_BADGE = {
  label: "Trợ lý AI",
  color: "#2F64F6",
  bg: "#ECF4FF",
};

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return "Vừa xong";
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} ngày trước`;
  return formatTime(iso);
}

function summarizeMarkdown(markdown: string, max = 120): string {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`-]/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > max ? `${stripped.slice(0, max - 1)}…` : stripped;
}

function UserBubble({ text }: { text: string }) {
  return (
    <div
      style={{
        maxWidth: 520,
        marginLeft: "auto",
        background: "#2F64F6",
        color: "#fff",
        padding: "14px 18px",
        borderRadius: "12px 12px 4px 12px",
        boxShadow: "var(--shadow-ambient)",
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
}

// The Haravan flow API doesn't truly stream — we wait for the full markdown.
// To make the wait feel responsive (responses can take 30-60s), we cycle
// through stage labels and pulse skeleton lines so the user sees progress.
const LOADING_STAGES = [
  "Đang phân tích câu hỏi",
  "Đang truy xuất dữ liệu liên quan",
  "Đang đối chiếu chính sách & ngữ cảnh",
  "Đang tổng hợp câu trả lời",
  "Sắp xong rồi",
];

function LoadingBubble() {
  const [stageIdx, setStageIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => {
      const sec = Math.floor((Date.now() - start) / 1000);
      setElapsed(sec);
      // Advance one stage every ~4s, hold on the last stage thereafter.
      setStageIdx(Math.min(LOADING_STAGES.length - 1, Math.floor(sec / 4)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${LOADING_STAGES[stageIdx]} — đã ${elapsed} giây`}
      style={{
        maxWidth: 520,
        background: "#fff",
        color: "#013652",
        borderRadius: "var(--radius-lg)",
        padding: "16px 18px",
        boxShadow: "0 12px 24px rgba(1,54,82,0.04)",
        border: "1px solid rgba(47,100,246,0.1)",
        animation: "fadeSlideIn 0.2s ease-out",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ECF4FF",
            flexShrink: 0,
          }}
        >
          <Bot size={16} style={{ color: "#2F64F6" }} />
        </div>
        <span
          key={stageIdx}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#013652",
            animation: "fadeSlideIn 0.25s ease-out",
          }}
        >
          {LOADING_STAGES[stageIdx]}
        </span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "flex-end",
            gap: 3,
            paddingBottom: 2,
          }}
        >
          <span className="ai-typing-dot" />
          <span className="ai-typing-dot" />
          <span className="ai-typing-dot" />
        </span>
        {elapsed >= 5 ? (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: "#8EB6D9",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {elapsed}s
          </span>
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div className="ai-skeleton-line" style={{ width: "94%" }} />
        <div className="ai-skeleton-line" style={{ width: "82%" }} />
        <div className="ai-skeleton-line" style={{ width: "66%" }} />
      </div>
    </div>
  );
}

function ErrorBubble({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      style={{
        maxWidth: 520,
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        background: "#FFF1F2",
        color: "#013652",
        borderRadius: "var(--radius-lg)",
        padding: "14px 18px",
        boxShadow: "var(--shadow-ambient)",
        fontSize: 14,
      }}
    >
      <AlertTriangle
        size={18}
        style={{ color: "#E11D48", flexShrink: 0, marginTop: 2 }}
      />
      <div>
        <div style={{ marginBottom: 8 }}>{message}</div>
        <Button variant="tertiary" onClick={onRetry} style={{ fontSize: 13 }}>
          <RefreshCw size={14} />
          Thử lại
        </Button>
      </div>
    </div>
  );
}

function AnswerCard({
  message,
  onUseSuggestion,
}: {
  message: ChatMessage;
  onUseSuggestion: (text: string) => void;
}) {
  const parsed = useMemo(
    () => parseSuggestions(message.content),
    [message.content],
  );

  return (
    <Card
      aria-live="polite"
      style={{
        maxWidth: 760,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        borderRadius: "16px",
        boxShadow: "0 12px 24px rgba(1,54,82,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          alignItems: "center",
        }}
      >
        <Badge
          label={ASSISTANT_BADGE.label}
          color={ASSISTANT_BADGE.color}
          bg={ASSISTANT_BADGE.bg}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "5px 12px",
            borderRadius: "var(--radius-pill)",
            background: "color-mix(in srgb, #22C55E 14%, white)",
            color: "#16A34A",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <Sparkles size={13} />
          {formatRelative(message.createdAt)}
        </div>
      </div>

      <MarkdownAnswer markdown={parsed.body} />

      {parsed.suggestions.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            paddingTop: "var(--space-2)",
            borderTop: "1px dashed rgba(47,100,246,0.16)",
            marginTop: "var(--space-1)",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#3A6381",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Câu hỏi gợi ý tiếp theo
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            {parsed.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onUseSuggestion(suggestion)}
                className="internal-prompt-chip"
                style={{
                  border: "1px solid rgba(47,100,246,0.18)",
                  cursor: "pointer",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-pill)",
                  background: "#F6F9FF",
                  color: "#013652",
                  fontFamily: "var(--font-primary)",
                  fontSize: 13,
                  lineHeight: 1.4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  transition:
                    "background 0.15s, border-color 0.15s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#ECF4FF";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(47,100,246,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#F6F9FF";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(47,100,246,0.18)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                <ArrowRight size={13} style={{ color: "#2F64F6" }} />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          alignItems: "center",
          paddingTop: "var(--space-2)",
        }}
      >
        {/* {hasSources && (
          <Button
            variant="secondary"
            onClick={() => onOpenSources(message.id)}
            aria-label="Xem nguồn trả lời"
          >
            <ExternalLink size={15} />
            Xem nguồn
          </Button>
        )}
        <Button variant="tertiary" onClick={() => onAction("Hỏi tiếp")}>
          <ArrowRight size={15} />
          Hỏi tiếp
        </Button>
        <Button
          variant="tertiary"
          onClick={() => onAction("Tạo yêu cầu hỗ trợ")}
        >
          <ArrowRight size={15} />
          Tạo yêu cầu hỗ trợ
        </Button> */}
        {/* <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            marginLeft: "auto",
          }}
        >
          <Button
            variant="tertiary"
            aria-label="Câu trả lời hữu ích"
            onClick={() => onFeedback("up")}
          >
            <ThumbsUp size={15} />
            Hữu ích
          </Button>
          <Button
            variant="tertiary"
            aria-label="Câu trả lời chưa đúng"
            onClick={() => onFeedback("down")}
          >
            <ThumbsDown size={15} />
            Chưa đúng
          </Button>
        </div> */}
      </div>
    </Card>
  );
}

function EmptyState({
  onUsePrompt,
}: {
  onUsePrompt: (prompt: string) => void;
}) {
  return (
    <Card
      style={{
        minHeight: 360,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "var(--space-5)",
        borderRadius: "16px",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ECF4FF",
            color: "#2F64F6",
            flexShrink: 0,
          }}
        >
          <MessageSquareText size={22} />
        </div>
        <div>
          <h3 style={{ color: "#013652", marginBottom: 4 }}>
            Xin chào! Tôi có thể giúp gì cho bạn?
          </h3>
          <div style={{ color: "#3A6381", fontSize: 13 }}>
            Hỏi về tồn kho, đơn hàng, chính sách, SOP — hoặc chọn một gợi ý bên
            dưới.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
        {PROMPT_CHIPS.map((prompt) => (
          <button
            className="internal-prompt-chip"
            key={prompt}
            type="button"
            onClick={() => onUsePrompt(prompt)}
            style={{
              border: "1px solid rgba(47,100,246,0.12)",
              cursor: "pointer",
              padding: "10px 16px",
              borderRadius: "var(--radius-pill)",
              background: "#F6F9FF",
              color: "#013652",
              fontFamily: "var(--font-primary)",
              fontSize: 13,
              lineHeight: 1.4,
              transition:
                "background 0.15s, border-color 0.15s, transform 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ECF4FF";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(47,100,246,0.3)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#F6F9FF";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(47,100,246,0.12)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </Card>
  );
}

function SourcesPanel({
  sources,
  onClose,
}: {
  sources: ExtractedSources;
  onClose: () => void;
}) {
  const empty = sources.links.length === 0 && sources.outline.length === 0;

  return (
    <Card
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        borderRadius: "16px",
        boxShadow: "0 12px 24px rgba(1,54,82,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#3A6381",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 6,
            }}
          >
            Nguồn trả lời
          </div>
          <h3 style={{ color: "#013652" }}>Chi tiết nguồn</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng panel nguồn trả lời"
          style={{
            border: "none",
            background: "transparent",
            color: "#3A6381",
            cursor: "pointer",
            display: "flex",
            padding: 4,
            borderRadius: "var(--radius-sm)",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {empty ? (
        <div style={{ color: "#3A6381", fontSize: 13, lineHeight: 1.6 }}>
          Câu trả lời được tổng hợp từ tri thức của Trợ lý — không có nguồn cụ
          thể được trích dẫn trong nội dung.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "var(--space-4)",
            overflow: "auto",
          }}
        >
          {sources.links.length > 0 && (
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#013652",
                }}
              >
                <ExternalLink size={14} style={{ color: "#2F64F6" }} />
                Liên kết tham chiếu
              </div>
              {sources.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    background: "#F6F9FF",
                    display: "grid",
                    gap: "var(--space-2)",
                    textDecoration: "none",
                    border: "1px solid transparent",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(47,100,246,0.25)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "transparent")
                  }
                >
                  <strong style={{ color: "#013652", fontSize: 13 }}>
                    {link.text}
                  </strong>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#2F64F6",
                      wordBreak: "break-all",
                    }}
                  >
                    {link.host}
                  </div>
                </a>
              ))}
            </div>
          )}

          {sources.outline.length > 0 && (
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#013652",
                }}
              >
                <ListTree size={14} style={{ color: "#2F64F6" }} />
                Outline câu trả lời
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: 4,
                }}
              >
                {sources.outline.map((h, i) => (
                  <li
                    key={`${h.text}-${i}`}
                    style={{
                      paddingLeft: h.level === 3 ? 16 : 0,
                      fontSize: 13,
                      color: h.level === 2 ? "#013652" : "#3A6381",
                      fontWeight: h.level === 2 ? 600 : 400,
                      lineHeight: 1.5,
                    }}
                  >
                    {h.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export function InternalAIChatPage() {
  const [draft, setDraft] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [actionNotice, setActionNotice] = useState("");
  const [activeSourceMessageId, setActiveSourceMessageId] = useState<
    string | null
  >(null);
  const [lastPrompt, setLastPrompt] = useState("");

  const threadEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const entryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const canSubmit =
    draft.trim().length > 0 && !isLoading && currentSessionId !== null;

  const activeSourceMessage = useMemo(
    () =>
      activeSourceMessageId
        ? (messages.find((m) => m.id === activeSourceMessageId) ?? null)
        : null,
    [activeSourceMessageId, messages],
  );

  const activeSources = useMemo<ExtractedSources | null>(
    () =>
      activeSourceMessage
        ? extractSources(parseSuggestions(activeSourceMessage.content).body)
        : null,
    [activeSourceMessage],
  );

  // Bootstrap: list sessions; restore newest or create blank.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await aiChatApi.listSessions();
        if (cancelled) return;
        if (list.length === 0) {
          const created = await aiChatApi.createSession();
          if (cancelled) return;
          setSessions([created]);
          setCurrentSessionId(created.id);
          setMessages([]);
        } else {
          setSessions(list);
          const latest = list[0]!;
          setCurrentSessionId(latest.id);
          const msgs = await aiChatApi.getMessages(latest.id);
          if (cancelled) return;
          setMessages(msgs);
        }
      } catch (err) {
        setActionNotice(
          getApiErrorMessage(err, "Không tải được lịch sử trò chuyện."),
        );
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!actionNotice) return;
    const timer = window.setTimeout(() => setActionNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [actionNotice]);

  function focusInputWithDraft(nextValue: string) {
    setDraft(nextValue);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  function reorderSession(updated: ChatSession) {
    setSessions((prev) => {
      const without = prev.filter((s) => s.id !== updated.id);
      return [updated, ...without];
    });
  }

  async function submitPrompt(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading || !currentSessionId) return;

    setLastPrompt(trimmed);
    setDraft("");
    setIsLoading(true);

    // Optimistic user bubble — replaced with the persisted record below.
    const optimisticId = `optimistic-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        sessionId: currentSessionId,
        role: "user",
        content: trimmed,
        meta: null,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      const result = await aiChatApi.sendMessage(currentSessionId, trimmed);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== optimisticId);
        const next = [...filtered, result.user];
        if (result.assistant) next.push(result.assistant);
        if (result.error) next.push(result.error);
        return next;
      });
      reorderSession(result.session);
    } catch (err) {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticId),
        {
          id: optimisticId,
          sessionId: currentSessionId,
          role: "user",
          content: trimmed,
          meta: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: `error-${Date.now()}`,
          sessionId: currentSessionId,
          role: "error",
          content: getApiErrorMessage(err, "Không gửi được câu hỏi."),
          meta: null,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSwitchSession(sessionId: string) {
    if (sessionId === currentSessionId) return;
    setActiveSourceMessageId(null);
    setCurrentSessionId(sessionId);
    setMessages([]);
    try {
      const msgs = await aiChatApi.getMessages(sessionId);
      setMessages(msgs);
    } catch (err) {
      setActionNotice(getApiErrorMessage(err, "Không tải được hội thoại."));
    }
  }

  async function handleNewSession() {
    if (isLoading) return;
    try {
      const created = await aiChatApi.createSession();
      setSessions((prev) => [created, ...prev]);
      setCurrentSessionId(created.id);
      setMessages([]);
      setActiveSourceMessageId(null);
      focusInputWithDraft("");
    } catch (err) {
      setActionNotice(
        getApiErrorMessage(err, "Không tạo được cuộc trò chuyện mới."),
      );
    }
  }

  async function handleDeleteSession(sessionId: string) {
    if (!window.confirm("Xoá cuộc trò chuyện này? Không thể khôi phục lại.")) {
      return;
    }
    try {
      await aiChatApi.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (sessionId === currentSessionId) {
        // Auto-switch to another session, or create one if list is now empty.
        const remaining = sessions.filter((s) => s.id !== sessionId);
        if (remaining.length > 0) {
          await handleSwitchSession(remaining[0]!.id);
        } else {
          await handleNewSession();
        }
      }
    } catch (err) {
      setActionNotice(getApiErrorMessage(err, "Không xoá được."));
    }
  }

  function handleRetry() {
    if (!lastPrompt) return;
    setMessages((prev) => prev.filter((m) => m.role !== "error"));
    submitPrompt(lastPrompt);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitPrompt(draft);
  }

  return (
    <div
      className="internal-chat-page"
      style={{
        display: "grid",
        gridTemplateColumns: activeSourceMessageId
          ? "minmax(0, 1fr) 360px"
          : "minmax(0, 1fr) 300px",
        gap: "var(--space-6)",
        minHeight: "100%",
        transition: "grid-template-columns 250ms ease-out",
      }}
    >
      <div
        className="internal-chat-column"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        <div style={{ marginBottom: "var(--space-2)" }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#3A6381",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            AI Workspace
          </span>
        </div>
        <h1 style={{ marginBottom: "var(--space-3)", color: "#013652" }}>
          Trợ lý AI Nội Bộ
        </h1>
        <p
          style={{
            marginBottom: "var(--space-6)",
            color: "#3A6381",
            maxWidth: 680,
            fontSize: 14,
          }}
        >
          Tra cứu tồn kho, đơn hàng, chính sách, và SOP nội bộ để xử lý công
          việc hằng ngày nhanh hơn.
        </p>

        <div
          aria-live="polite"
          aria-label="Lịch sử hội thoại"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            paddingBottom: "96px",
          }}
        >
          {!isBootstrapping && messages.length === 0 && !isLoading ? (
            <EmptyState onUsePrompt={(prompt) => submitPrompt(prompt)} />
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              ref={(node) => {
                entryRefs.current[message.id] = node;
              }}
              data-message-id={message.id}
            >
              {message.role === "user" ? (
                <UserBubble text={message.content} />
              ) : null}
              {message.role === "error" ? (
                <ErrorBubble message={message.content} onRetry={handleRetry} />
              ) : null}
              {message.role === "assistant" ? (
                <AnswerCard
                  message={message}
                  onUseSuggestion={(text) => submitPrompt(text)}
                />
              ) : null}
            </div>
          ))}

          {isLoading ? <LoadingBubble /> : null}
          <div ref={threadEndRef} />
        </div>

        {actionNotice ? (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginBottom: "var(--space-3)",
              borderRadius: "var(--radius-md)",
              background: "#ECF4FF",
              color: "#013652",
              fontSize: 13,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              animation: "fadeSlideIn 0.2s ease-out",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#2F64F6",
                flexShrink: 0,
              }}
            />
            {actionNotice}
          </div>
        ) : null}

        <form
          className="internal-chat-dock"
          onSubmit={handleSubmit}
          style={{
            position: "sticky",
            bottom: 0,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "10px 10px 10px 18px",
            borderRadius: "var(--radius-pill)",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 4px 24px rgba(1,54,82,0.1), 0 0 0 1px rgba(47,100,246,0.08)",
          }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              isBootstrapping
                ? "Đang tải hội thoại..."
                : "Nhập câu hỏi của bạn..."
            }
            aria-label="Nhập câu hỏi"
            disabled={isBootstrapping}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#013652",
              font: "inherit",
              fontSize: 14,
            }}
          />
          <Button
            type="submit"
            disabled={!canSubmit}
            aria-label="Gửi câu hỏi"
            style={{
              opacity: canSubmit ? 1 : 0.4,
              transition: "opacity 0.15s, transform 0.1s",
              transform: canSubmit ? "scale(1)" : "scale(0.97)",
              borderRadius: "var(--radius-pill)",
              padding: "10px 18px",
            }}
          >
            <Send size={15} />
            Gửi
          </Button>
        </form>
      </div>

      <div
        className="internal-chat-side-panel"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
          position: "sticky",
          top: 16,
          alignSelf: "flex-start",
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
        }}
      >
        {activeSources && activeSourceMessage ? (
          <SourcesPanel
            sources={activeSources}
            onClose={() => setActiveSourceMessageId(null)}
          />
        ) : null}

        <Card
          style={{
            borderRadius: "16px",
            boxShadow: "0 12px 24px rgba(1,54,82,0.04)",
            display: "grid",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#3A6381",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Lịch sử hỏi đáp nội bộ
            </div>
            <Button
              variant="tertiary"
              onClick={handleNewSession}
              disabled={isLoading}
              style={{ fontSize: 12, padding: "6px 10px" }}
              aria-label="Tạo cuộc trò chuyện mới"
            >
              <Plus size={14} />
              Mới
            </Button>
          </div>

          {sessions.length === 0 ? (
            <div style={{ color: "#3A6381", fontSize: 13 }}>
              {isBootstrapping ? "Đang tải..." : "Chưa có lịch sử hội thoại."}
            </div>
          ) : (
            sessions.slice(0, 12).map((session) => {
              const isActive = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  style={{
                    border: isActive
                      ? "1px solid rgba(47,100,246,0.3)"
                      : "1px solid transparent",
                    borderRadius: "var(--radius-md)",
                    background: isActive ? "#ECF4FF" : "#F6F9FF",
                    display: "flex",
                    alignItems: "stretch",
                    gap: 4,
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSwitchSession(session.id)}
                    style={{
                      flex: 1,
                      border: "none",
                      background: "transparent",
                      padding: "10px 12px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "var(--space-3)",
                      }}
                    >
                      <Badge
                        label={ASSISTANT_BADGE.label}
                        color={ASSISTANT_BADGE.color}
                        bg={ASSISTANT_BADGE.bg}
                      />
                      <span style={{ color: "#8EB6D9", fontSize: 11 }}>
                        {formatRelative(session.lastActiveAt)}
                      </span>
                    </div>
                    <div
                      style={{
                        color: "#013652",
                        fontSize: 13,
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {session.title}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSession(session.id)}
                    aria-label="Xoá cuộc trò chuyện"
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#8EB6D9",
                      padding: "0 10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#E11D48";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#8EB6D9";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}

          {messages.length > 0 && currentSessionId ? (
            <div
              style={{
                marginTop: "var(--space-2)",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                background: "#F6F9FF",
                fontSize: 12,
                color: "#3A6381",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "#013652" }}>Phiên hiện tại:</strong>{" "}
              {messages.length} tin nhắn
              {messages.find((m) => m.role === "assistant") && (
                <>
                  {" — "}
                  {summarizeMarkdown(
                    [...messages].reverse().find((m) => m.role === "assistant")!
                      .content,
                    80,
                  )}
                </>
              )}
            </div>
          ) : null}
        </Card>

        {!activeSourceMessageId && (
          <Card
            style={{
              borderRadius: "16px",
              boxShadow: "0 12px 24px rgba(1,54,82,0.04)",
            }}
          >
            <div style={{ marginBottom: "var(--space-4)" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#3A6381",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                Phạm vi hỗ trợ
              </div>
              <h3 style={{ color: "#013652" }}>Trợ lý có thể giúp gì</h3>
            </div>
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {SUPPORT_ACTIONS.map((support) => (
                <button
                  key={support.label}
                  type="button"
                  onClick={() => submitPrompt(support.prompt)}
                  style={{
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 12px",
                    background: "#F6F9FF",
                    color: "#3A6381",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {support.label}
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
