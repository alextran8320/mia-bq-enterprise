import { FormEvent, startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Database,
  ExternalLink,
  FileText,
  Lock,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  AnswerScenario,
  INTERNAL_CHAT_SCENARIOS,
  inferScenarioFromPrompt,
} from "@/mocks/ai-workspace/internalChat";

type ChatEntry =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; scenario: AnswerScenario }
  | { id: string; role: "error" };

const PROMPT_CHIPS = INTERNAL_CHAT_SCENARIOS.slice(0, 5).map((s) => s.prompt);

// ---------------------------------------------------------------------------
// Badge helpers
// ---------------------------------------------------------------------------
function getAnswerBadge(scenario: AnswerScenario) {
  switch (scenario.answerType) {
    case "Policy":
      return { label: "Chính sách", color: "#013652", bg: "#ECF2FE", icon: FileText };
    case "Data":
      return { label: "Dữ liệu", color: "#2F64F6", bg: "#ECF2FE", icon: Database };
    case "Mixed":
      return { label: "Kết hợp", color: "#B45309", bg: "#FFFBEB", icon: Sparkles };
    case "Unsupported":
      return { label: "Ngoài phạm vi", color: "#E11D48", bg: "#FFF1F2", icon: ShieldAlert };
    default: // Blocked
      return { label: "Không đủ quyền", color: "#E11D48", bg: "#FFF1F2", icon: Lock };
  }
}

function getFreshnessTone(state: AnswerScenario["freshnessState"]) {
  switch (state) {
    case "fresh":
      return { color: "#16A34A", bg: "color-mix(in srgb, #22C55E 14%, white)" };
    case "stale":
      return { color: "#B45309", bg: "color-mix(in srgb, #F59E0B 14%, white)" };
    default: // conflict
      return { color: "#E11D48", bg: "color-mix(in srgb, #E11D48 12%, white)" };
  }
}

// ---------------------------------------------------------------------------
// UserBubble
// ---------------------------------------------------------------------------
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
      }}
    >
      {text}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LoadingBubble
// ---------------------------------------------------------------------------
function LoadingBubble() {
  return (
    <div
      role="status"
      aria-label="Đang phân tích câu hỏi"
      style={{
        maxWidth: 320,
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        background: "#ECF4FF",
        color: "#013652",
        borderRadius: "var(--radius-lg)",
        padding: "14px 18px",
        boxShadow: "var(--shadow-ambient)",
        fontSize: 14,
      }}
    >
      <Bot size={18} style={{ color: "#2F64F6", flexShrink: 0 }} />
      <span>Đang phân tích...</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ErrorBubble
// ---------------------------------------------------------------------------
function ErrorBubble({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      style={{
        maxWidth: 400,
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
      <AlertTriangle size={18} style={{ color: "#E11D48", flexShrink: 0, marginTop: 2 }} />
      <div>
        <div style={{ marginBottom: 8 }}>Đã có lỗi xảy ra. Câu hỏi của bạn chưa được xử lý.</div>
        <Button variant="tertiary" onClick={onRetry} style={{ fontSize: 13 }}>
          <RefreshCw size={14} />
          Thử lại
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AnswerCard
// ---------------------------------------------------------------------------
function AnswerCard({
  scenario,
  onOpenTrace,
}: {
  scenario: AnswerScenario;
  onOpenTrace: (scenario: AnswerScenario) => void;
}) {
  const badge = getAnswerBadge(scenario);
  const freshness = getFreshnessTone(scenario.freshnessState);
  const BadgeIcon = badge.icon;
  const isBlocked = scenario.answerType === "Blocked" || scenario.answerType === "Unsupported";

  return (
    <Card
      aria-live="polite"
      style={{
        maxWidth: 760,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
        borderRadius: "16px",
        boxShadow: "0 12px 24px rgba(1,54,82,0.04)",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
        <Badge label={badge.label} color={badge.color} bg={badge.bg} />
        {scenario.answerType !== "Unsupported" && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "5px 12px",
              borderRadius: "var(--radius-pill)",
              background: freshness.bg,
              color: freshness.color,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <BadgeIcon size={13} />
            {scenario.freshnessLabel}
          </div>
        )}
      </div>

      {/* Warning */}
      {scenario.warning ? (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-3)",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            background: "#FFFBEB",
            color: "#92400E",
            fontSize: 13,
          }}
        >
          <AlertTriangle size={15} style={{ color: "#F59E0B", marginTop: 2, flexShrink: 0 }} />
          <span>{scenario.warning}</span>
        </div>
      ) : null}

      {/* Kết luận */}
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
          Kết luận
        </div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#013652",
            marginBottom: isBlocked ? "var(--space-3)" : 0,
            lineHeight: 1.5,
          }}
        >
          {isBlocked ? (
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Lock size={18} style={{ color: "#E11D48", flexShrink: 0 }} />
              {scenario.summary}
            </span>
          ) : (
            scenario.summary
          )}
        </h3>

        {scenario.blockedReason ? (
          <div
            style={{
              marginTop: "var(--space-3)",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              background: "#FFF1F2",
              color: "#3A6381",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {scenario.blockedReason}
          </div>
        ) : null}

        {/* Clarifying question cho Unsupported */}
        {scenario.clarifyingQuestion ? (
          <div
            style={{
              marginTop: "var(--space-3)",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              background: "#ECF4FF",
              color: "#013652",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {scenario.clarifyingQuestion}
          </div>
        ) : null}
      </div>

      {/* Mixed — 2 khối song song */}
      {scenario.answerType === "Mixed" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              padding: "var(--space-5)",
              borderRadius: "var(--radius-md)",
              background: "#F6F9FF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                marginBottom: "var(--space-3)",
              }}
            >
              <Database size={15} style={{ color: "#2F64F6" }} />
              <strong style={{ fontSize: 13 }}>Dữ liệu hiện tại</strong>
            </div>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              {scenario.dataPoints?.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "var(--space-4)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#3A6381" }}>{item.label}</span>
                  <strong style={{ color: "#013652" }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "var(--space-5)",
              borderRadius: "var(--radius-md)",
              background: "#F6F9FF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                marginBottom: "var(--space-3)",
              }}
            >
              <FileText size={15} style={{ color: "#013652" }} />
              <strong style={{ fontSize: 13 }}>Chính sách áp dụng</strong>
            </div>
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {scenario.citations?.map((item) => (
                <div key={item.title} style={{ fontSize: 13 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: "#013652" }}>
                    {item.title}
                  </div>
                  <div style={{ color: "#3A6381", lineHeight: 1.5 }}>{item.excerpt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Data — grid data points */}
      {scenario.answerType === "Data" && scenario.dataPoints ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {scenario.dataPoints.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "#F6F9FF",
              }}
            >
              <div style={{ color: "#3A6381", fontSize: 12, marginBottom: 6 }}>{item.label}</div>
              <strong style={{ color: "#013652", fontSize: 14 }}>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : null}

      {/* Policy — citations */}
      {scenario.answerType === "Policy" && scenario.citations ? (
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {scenario.citations.map((item) => (
            <div
              key={item.title}
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "#F6F9FF",
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6, color: "#013652" }}>{item.title}</div>
              <div style={{ color: "#3A6381", lineHeight: 1.5 }}>{item.excerpt}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Action row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          alignItems: "center",
          paddingTop: "var(--space-2)",
        }}
      >
        {scenario.sourceTrace.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => onOpenTrace(scenario)}
            aria-label="Xem nguồn trả lời"
          >
            <ExternalLink size={15} />
            Xem nguồn
          </Button>
        )}
        {scenario.nextActions
          .filter((a) => a !== "Xem nguồn")
          .map((action) => (
            <Button key={action} variant="tertiary">
              <ArrowRight size={15} />
              {action}
            </Button>
          ))}

        {!isBlocked && (
          <div style={{ display: "flex", gap: "var(--space-2)", marginLeft: "auto" }}>
            <Button variant="tertiary" aria-label="Câu trả lời hữu ích">
              <ThumbsUp size={15} />
              Hữu ích
            </Button>
            <Button variant="tertiary" aria-label="Câu trả lời chưa đúng">
              <ThumbsDown size={15} />
              Chưa đúng
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------
function EmptyState({ onUsePrompt }: { onUsePrompt: (prompt: string) => void }) {
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
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
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
          <h3 style={{ color: "#013652", marginBottom: 4 }}>Xin chào! Tôi có thể giúp gì cho bạn?</h3>
          <div style={{ color: "#3A6381", fontSize: 13 }}>
            Hỏi về tồn kho, đơn hàng, chính sách, SOP — hoặc chọn một gợi ý bên dưới.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
        {PROMPT_CHIPS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onUsePrompt(prompt)}
            style={{
              border: "none",
              cursor: "pointer",
              padding: "10px 16px",
              borderRadius: "var(--radius-pill)",
              background: "#F6F9FF",
              color: "#013652",
              boxShadow: "var(--shadow-ambient)",
              fontFamily: "var(--font-primary)",
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// InternalAIChatPage
// ---------------------------------------------------------------------------
export function InternalAIChatPage() {
  const [draft, setDraft] = useState("");
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [activeTrace, setActiveTrace] = useState<AnswerScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const threadEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const traceCloseRef = useRef<HTMLButtonElement>(null);

  const canSubmit = draft.trim().length > 0 && !isLoading;

  const lastScenario = useMemo(() => {
    const assistantEntries = entries.filter(
      (e): e is Extract<ChatEntry, { role: "assistant" }> => e.role === "assistant",
    );
    return assistantEntries.at(-1)?.scenario ?? null;
  }, [entries]);

  // Scroll to bottom khi có entry mới
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, isLoading]);

  // Trả focus về input sau khi đóng source trace
  function handleCloseTrace() {
    setActiveTrace(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function submitPrompt(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;

    const scenario = inferScenarioFromPrompt(trimmed);
    setLastPrompt(trimmed);

    startTransition(() => {
      setEntries((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", text: trimmed }]);
    });
    setDraft("");
    setIsLoading(true);

    window.setTimeout(() => {
      startTransition(() => {
        setEntries((prev) => [
          ...prev,
          { id: `assistant-${Date.now()}`, role: "assistant", scenario },
        ]);
      });
      setIsLoading(false);
    }, 700);
  }

  function handleRetry() {
    // Xóa error entry cuối, gửi lại prompt gần nhất
    setEntries((prev) => prev.filter((e) => e.role !== "error"));
    if (lastPrompt) submitPrompt(lastPrompt);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitPrompt(draft);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: activeTrace ? "minmax(0, 1fr) 360px" : "minmax(0, 1fr) 300px",
        gap: "var(--space-6)",
        minHeight: "100%",
        transition: "grid-template-columns 250ms ease-out",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Chat column                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>
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
        <h1 style={{ marginBottom: "var(--space-3)", color: "#013652" }}>Trợ lý AI Nội Bộ</h1>
        <p style={{ marginBottom: "var(--space-6)", color: "#3A6381", maxWidth: 680, fontSize: 14 }}>
          Tra cứu tồn kho, đơn hàng, chính sách, và SOP nội bộ. Dữ liệu từ mock — đang trong quá trình xây dựng.
        </p>

        {/* Message thread */}
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
          {entries.length === 0 && !isLoading ? (
            <EmptyState onUsePrompt={(p) => { setDraft(p); submitPrompt(p); }} />
          ) : null}

          {entries.map((entry) => {
            if (entry.role === "user") return <UserBubble key={entry.id} text={entry.text} />;
            if (entry.role === "error") return <ErrorBubble key={entry.id} onRetry={handleRetry} />;
            return (
              <AnswerCard key={entry.id} scenario={entry.scenario} onOpenTrace={setActiveTrace} />
            );
          })}

          {isLoading ? <LoadingBubble /> : null}
          <div ref={threadEndRef} />
        </div>

        {/* Floating Dock */}
        <form
          onSubmit={handleSubmit}
          style={{
            position: "sticky",
            bottom: 0,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "12px 16px",
            borderRadius: "var(--radius-pill)",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 12px 24px rgba(1,54,82,0.08)",
          }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            aria-label="Nhập câu hỏi"
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
            style={{ opacity: canSubmit ? 1 : 0.4 }}
          >
            <Send size={15} />
            Gửi
          </Button>
        </form>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right panel                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {/* Source Trace panel (slide-in khi mở) */}
        <Card
          style={{
            flex: activeTrace ? 1 : undefined,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            borderRadius: "16px",
            boxShadow: "0 12px 24px rgba(1,54,82,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
              <h3 style={{ color: "#013652" }}>
                {activeTrace ? "Chi tiết nguồn" : "Chưa mở nguồn nào"}
              </h3>
            </div>
            {activeTrace ? (
              <button
                ref={traceCloseRef}
                type="button"
                onClick={handleCloseTrace}
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
            ) : null}
          </div>

          {activeTrace ? (
            <div style={{ display: "grid", gap: "var(--space-4)", overflow: "auto" }}>
              {activeTrace.sourceTrace.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    background: "#F6F9FF",
                    display: "grid",
                    gap: "var(--space-2)",
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
                    <strong style={{ color: "#013652", fontSize: 13 }}>{item.title}</strong>
                    <Badge
                      label={item.trust}
                      color={item.trust === "High" ? "#16A34A" : item.trust === "Medium" ? "#B45309" : "#E11D48"}
                      bg={
                        item.trust === "High"
                          ? "color-mix(in srgb, #22C55E 12%, white)"
                          : item.trust === "Medium"
                          ? "color-mix(in srgb, #F59E0B 12%, white)"
                          : "color-mix(in srgb, #E11D48 12%, white)"
                      }
                    />
                  </div>
                  <div style={{ color: "#3A6381", fontSize: 13, lineHeight: 1.5 }}>{item.excerpt}</div>
                  <div style={{ fontSize: 12, color: "#3A6381", fontWeight: 500 }}>{item.source}</div>
                  <div style={{ fontSize: 11, color: "#8EB6D9" }}>{item.freshness}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#3A6381", fontSize: 13 }}>
              Nhấn <strong>Xem nguồn</strong> trên một câu trả lời để xem citation, freshness, và trust signal.
            </div>
          )}

          {lastScenario && !activeTrace ? (
            <div
              style={{
                marginTop: "auto",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "#ECF4FF",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#2F64F6",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                Câu hỏi gần nhất
              </div>
              <strong style={{ color: "#013652", fontSize: 13 }}>{lastScenario.prompt}</strong>
            </div>
          ) : null}
        </Card>

        {/* Scope card — chỉ hiện khi chưa mở source trace */}
        {!activeTrace && (
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
            <div style={{ display: "grid", gap: "var(--space-3)", color: "#3A6381", fontSize: 13 }}>
              <div>Tra cứu tồn kho và sản phẩm</div>
              <div>Kiểm tra trạng thái đơn hàng</div>
              <div>Chính sách đổi trả và giao hàng</div>
              <div>SOP vận hành cửa hàng</div>
              <div>Khuyến mãi đang áp dụng</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
