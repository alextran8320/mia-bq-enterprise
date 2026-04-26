import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Bot,
  BookOpen,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  FileText,
  History,
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Paperclip,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { Avatar, Input } from "@/shared/ui";
import {
  CONVERSATIONS,
  MESSAGES,
  type Channel,
  type Conversation,
  type Message,
  getChannelLabel,
  getStageLabel,
} from "@/mocks/inbox/conversations";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "langflow-chat": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          window_title?: string;
          flow_id?: string;
          host_url?: string;
          api_key?: string;
        },
        HTMLElement
      >;
    }
  }
}

const LANGFLOW_SCRIPT_ID = "langflow-embedded-chat-script";
const LANGFLOW_SCRIPT_SRC =
  "https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js";

function FacebookIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.47h-2.796v8.384C19.612 22.954 24 17.99 24 12"
        fill="#1877F2"
      />
    </svg>
  );
}

function ZaloIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#03A5FA" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="bold"
        fontSize="20"
        letterSpacing="-0.5"
      >
        Zalo
      </text>
    </svg>
  );
}

function InstagramIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        stroke="#fff"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="#fff"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
    </svg>
  );
}

function WebIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke="#0F766E"
        strokeWidth="1.5"
        fill="#ECFEFF"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="4.5"
        ry="11"
        stroke="#0F766E"
        strokeWidth="1.2"
        fill="none"
      />
      <line x1="1" y1="12" x2="23" y2="12" stroke="#0F766E" strokeWidth="1.2" />
      <line
        x1="3.5"
        y1="7"
        x2="20.5"
        y2="7"
        stroke="#0F766E"
        strokeWidth="0.8"
      />
      <line
        x1="3.5"
        y1="17"
        x2="20.5"
        y2="17"
        stroke="#0F766E"
        strokeWidth="0.8"
      />
    </svg>
  );
}

const CHANNEL_META: Record<
  Channel,
  {
    icon: ReactElement;
    chipBg: string;
    chipText: string;
    chipBorder: string;
  }
> = {
  facebook: {
    icon: <FacebookIcon size={12} />,
    chipBg: "#EFF6FF",
    chipText: "#1877F2",
    chipBorder: "#BFDBFE",
  },
  zalo: {
    icon: <ZaloIcon size={12} />,
    chipBg: "#EEF2FF",
    chipText: "#0068FF",
    chipBorder: "#C7D2FE",
  },
  instagram: {
    icon: <InstagramIcon size={12} />,
    chipBg: "#FDF2F8",
    chipText: "#E1306C",
    chipBorder: "#FBCFE8",
  },
  web: {
    icon: <WebIcon size={12} />,
    chipBg: "#ECFEFF",
    chipText: "#115E59",
    chipBorder: "#99F6E4",
  },
};

function ChannelIcon({ channel }: { channel: Channel }) {
  return CHANNEL_META[channel].icon;
}

function StageBadge({ stage }: { stage: Conversation["customer"]["stage"] }) {
  const palette =
    stage === "customer"
      ? { color: "var(--color-success)", bg: "#F0FDF4", border: "#BBF7D0" }
      : stage === "qualified"
        ? {
            color: "var(--color-primary)",
            bg: "var(--color-primary-light)",
            border: "var(--color-primary-muted)",
          }
        : {
            color: "var(--color-text-secondary)",
            bg: "var(--color-bg-surface)",
            border: "var(--color-border)",
          };

  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: "var(--radius-pill)",
        background: palette.bg,
        color: palette.color,
        border: `1px solid ${palette.border}`,
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      {getStageLabel(stage)}
    </span>
  );
}

function DeliveryIcon({ status }: { status?: Message["deliveryStatus"] }) {
  if (!status || status === "sending") {
    return (
      <Loader2
        size={12}
        style={{
          color: "var(--color-text-tertiary)",
          animation: "spin 1s linear infinite",
        }}
      />
    );
  }
  if (status === "failed")
    return <AlertCircle size={12} style={{ color: "var(--color-error)" }} />;
  if (status === "read")
    return <CheckCheck size={12} style={{ color: "var(--color-primary)" }} />;
  if (status === "delivered")
    return (
      <CheckCheck size={12} style={{ color: "var(--color-text-tertiary)" }} />
    );
  return <Check size={12} style={{ color: "var(--color-text-tertiary)" }} />;
}

function BotToggleModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)" as unknown as number,
        background: "rgba(15,23,42,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--color-bg-card)",
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-dropdown)",
          padding: "var(--space-6)",
          width: 360,
          maxWidth: "calc(100vw - 32px)",
          border: "1px solid var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "var(--radius-sm)",
              background: "var(--color-primary-light)",
              border: "1px solid var(--color-primary-muted)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Bot size={16} color="var(--color-primary)" />
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            Tắt chatbot?
          </h3>
        </div>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
            margin: "0 0 var(--space-5)",
          }}
        >
          Bot sẽ dừng tự động trả lời trong hội thoại này. Bạn sẽ tiếp tục xử lý
          trực tiếp với khách hàng.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onCancel} style={outlineBtnStyle}>
            Huỷ
          </button>
          <button onClick={onConfirm} style={primaryBtnStyle}>
            Xác nhận tắt
          </button>
        </div>
      </div>
    </div>
  );
}

const primaryBtnStyle: CSSProperties = {
  padding: "8px 14px",
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "var(--color-primary)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const outlineBtnStyle: CSSProperties = {
  padding: "8px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-card)",
  color: "var(--color-text-secondary)",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
};

/* ── Mock AI response detail data — ngữ cảnh Giày BQ ── */
const MOCK_AI_DETAIL = {
  explanation:
    "Theo quy tắc chào hỏi lượt đầu tiên, bot đã chào khách và hỏi nhu cầu cụ thể. Khách hỏi về giày thể thao → bot phân loại nhu cầu, đưa ra 2 dòng sản phẩm phù hợp (BQ Runner, BQ Sport) kèm mức giá tham khảo, đồng thời hỏi thêm về mục đích sử dụng để tư vấn chính xác hơn.",
  context: {
    messageGoal:
      "Phân loại nhu cầu khách hàng và gợi ý sản phẩm phù hợp kèm giá tham khảo.",
    conversationGoal:
      "Hiểu rõ nhu cầu sử dụng (chạy bộ / dạo phố / tập gym) để tư vấn đúng dòng sản phẩm BQ.",
    summary:
      "Khách hàng đang tìm giày thể thao, cần tư vấn dòng sản phẩm phù hợp.",
    language: "Tiếng Việt",
    customerStatus: "new",
    readiness: "Cân nhắc",
    journey: "Trước mua",
    bookingUpdate: "Không",
    customerUpdate: "Không",
    gender: "Nữ",
  },
  sources: {
    knowledge: [
      "KỊCH BẢN CHÀO HỎI & PHÂN LOẠI NHU CẦU",
      "KỊCH BẢN TƯ VẤN THEO DÒNG SẢN PHẨM",
    ],
    services: ["Giày thể thao BQ Runner", "Giày thể thao BQ Sport"],
    rules: [
      {
        title: "QUY TẮC CHÀO HỎI LƯỢT ĐẦU (BẮT BUỘC)",
        snippet:
          "Kiểm tra số lượng tin nhắn trong conversationHistory. NẾU CHƯA CÓ tin nhắn nào từ Agent: Đây là lượt trả lời đầu tiên. BẮT BUỘC bắt đầu bằng lời chào.",
      },
      {
        title: "KỊCH BẢN TƯ VẤN THEO DÒNG SẢN PHẨM",
        snippet:
          "Giày thể thao: Hỏi mục đích sử dụng (chạy bộ / gym / dạo phố). Gợi ý BQ Runner (chạy bộ, 549K–799K) hoặc BQ Sport (gym/dạo phố, 450K–650K). Luôn hỏi size và màu ưa thích.",
      },
    ],
  },
};

function AiDetailPopup({ onClose }: { onClose: () => void }) {
  const sectionHeading = (icon: ReactElement, label: string): ReactElement => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      }}
    >
      {icon}
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--color-text-primary)",
        }}
      >
        {label}
      </span>
    </div>
  );

  const sourceChip = (
    icon: ReactElement,
    label: string,
    color: string,
    border: string,
  ): ReactElement => (
    <span
      style={{
        padding: "5px 14px",
        borderRadius: "var(--radius-pill)",
        fontSize: 13,
        fontWeight: 500,
        background: "#fff",
        border: `1.5px solid ${border}`,
        color,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon}
      {label}
    </span>
  );

  const metaChip = (
    label: string,
    value: string,
    color?: string,
    border?: string,
  ): ReactElement => (
    <span
      style={{
        padding: "5px 12px",
        borderRadius: "var(--radius-pill)",
        fontSize: 12,
        fontWeight: 500,
        background: "#fff",
        border: `1px solid ${border ?? "var(--color-border)"}`,
        color: color ?? "var(--color-text-secondary)",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {label}: <span style={{ fontWeight: 600 }}>{value}</span>
    </span>
  );

  const resourceCard = (
    icon: ReactElement,
    title: string,
    bgColor: string,
    borderColor: string,
  ): ReactElement => (
    <div
      style={{
        padding: "10px 14px",
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-sm)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 500,
          color: "var(--color-text-primary)",
        }}
      >
        {icon}
        {title}
      </div>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#fff",
          border: `1px solid ${borderColor}`,
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
        }}
      >
        <Info size={12} color="var(--color-primary)" />
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)" as unknown as number,
        background: "rgba(15,23,42,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)",
          width: 580,
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 80px)",
          border: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Info size={20} color="var(--color-primary)" />
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--color-text-primary)",
              }}
            >
              Chi tiết phản hồi AI
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-tertiary)",
              padding: 4,
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Cơ sở phản hồi */}
          <div>
            {sectionHeading(
              <Sparkles size={16} color="#16A34A" />,
              "Cơ sở phản hồi",
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sourceChip(
                <FileText size={13} />,
                "Prompt",
                "#16A34A",
                "#BBF7D0",
              )}
              {sourceChip(<Tag size={13} />, "Dịch vụ", "#16A34A", "#BBF7D0")}
              {sourceChip(
                <ShieldCheck size={13} />,
                "Quy tắc",
                "#EA580C",
                "#FED7AA",
              )}
              {sourceChip(
                <BookOpen size={13} />,
                "Kiến thức",
                "#2563EB",
                "#BFDBFE",
              )}
            </div>
          </div>

          {/* Giải thích */}
          <div>
            <p
              style={{
                fontSize: 11.5,
                color: "var(--color-text-tertiary)",
                margin: "0 0 6px",
                fontWeight: 500,
              }}
            >
              Giải thích
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {MOCK_AI_DETAIL.explanation}
            </p>
          </div>

          {/* Phân tích ngữ cảnh */}
          <div>
            {sectionHeading(
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect
                  x="1"
                  y="9"
                  width="3"
                  height="6"
                  rx="1"
                  fill="var(--color-primary)"
                />
                <rect
                  x="6"
                  y="5"
                  width="3"
                  height="10"
                  rx="1"
                  fill="var(--color-primary)"
                  opacity="0.6"
                />
                <rect
                  x="11"
                  y="1"
                  width="3"
                  height="14"
                  rx="1"
                  fill="var(--color-primary)"
                  opacity="0.35"
                />
              </svg>,
              "Phân tích ngữ cảnh",
            )}

            {/* Vertical label-value fields */}
            <div style={{ marginBottom: 14 }}>
              <p
                style={{
                  fontSize: 11.5,
                  color: "var(--color-text-tertiary)",
                  margin: "0 0 4px",
                  fontWeight: 500,
                }}
              >
                Mục tiêu tin nhắn
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-primary)",
                  margin: "0 0 16px",
                  lineHeight: 1.5,
                }}
              >
                {MOCK_AI_DETAIL.context.messageGoal}
              </p>

              <p
                style={{
                  fontSize: 11.5,
                  color: "var(--color-text-tertiary)",
                  margin: "0 0 4px",
                  fontWeight: 500,
                }}
              >
                Mục tiêu hội thoại
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-primary)",
                  margin: "0 0 16px",
                  lineHeight: 1.5,
                }}
              >
                {MOCK_AI_DETAIL.context.conversationGoal}
              </p>

              <p
                style={{
                  fontSize: 11.5,
                  color: "var(--color-text-tertiary)",
                  margin: "0 0 4px",
                  fontWeight: 500,
                }}
              >
                Tóm tắt
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-primary)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {MOCK_AI_DETAIL.context.summary}
              </p>
            </div>

            {/* Meta chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {metaChip("Ngôn ngữ", MOCK_AI_DETAIL.context.language)}
              {metaChip(
                "Trạng thái KH",
                MOCK_AI_DETAIL.context.customerStatus,
                "#DC2626",
                "#FECACA",
              )}
              {metaChip(
                "Mức sẵn sàng",
                MOCK_AI_DETAIL.context.readiness,
                "#EA580C",
                "#FED7AA",
              )}
              {metaChip(
                "Hành trình KH",
                MOCK_AI_DETAIL.context.journey,
                "#2563EB",
                "#BFDBFE",
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              {metaChip(
                "Cập nhật booking",
                MOCK_AI_DETAIL.context.bookingUpdate,
              )}
              {metaChip("Cập nhật KH", MOCK_AI_DETAIL.context.customerUpdate)}
              {metaChip(
                "Giới tính KH",
                MOCK_AI_DETAIL.context.gender,
                "#9333EA",
                "#E9D5FF",
              )}
            </div>
          </div>

          {/* Tài nguyên sử dụng */}
          <div>
            {sectionHeading(
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 3.5C2 2.67 2.67 2 3.5 2h9c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z"
                  fill="#F59E0B"
                  opacity="0.2"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                />
                <path
                  d="M5 6h6M5 8.5h4"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>,
              "Tài nguyên sử dụng",
            )}

            {/* Kiến thức */}
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-tertiary)",
                margin: "0 0 8px",
                fontWeight: 500,
              }}
            >
              Kiến thức ({MOCK_AI_DETAIL.sources.knowledge.length})
            </p>
            {MOCK_AI_DETAIL.sources.knowledge.map((k, i) => (
              <span key={i}>
                {resourceCard(
                  <FileText size={14} color="#2563EB" />,
                  k,
                  "#F0F9FF",
                  "#BFDBFE",
                )}
              </span>
            ))}

            {/* Dịch vụ */}
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-tertiary)",
                margin: "12px 0 8px",
                fontWeight: 500,
              }}
            >
              Dịch vụ ({MOCK_AI_DETAIL.sources.services.length})
            </p>
            {MOCK_AI_DETAIL.sources.services.map((s, i) => (
              <span key={i}>
                {resourceCard(
                  <Tag size={14} color="#0F766E" />,
                  s,
                  "#ECFEFF",
                  "#99F6E4",
                )}
              </span>
            ))}

            {/* Quy tắc */}
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-tertiary)",
                margin: "12px 0 8px",
                fontWeight: 500,
              }}
            >
              Quy tắc ({MOCK_AI_DETAIL.sources.rules.length})
            </p>
            {MOCK_AI_DETAIL.sources.rules.map((r, i) => (
              <span key={i}>
                {resourceCard(
                  <ShieldCheck size={14} color="#9333EA" />,
                  r.title,
                  "#FAF5FF",
                  "#E9D5FF",
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "none",
              color: "var(--color-text-secondary)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Đóng
          </button>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid #BBF7D0",
              background: "#F0FDF4",
              color: "#16A34A",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FileText size={14} />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}

function getFilterButtonStyle(active: boolean): CSSProperties {
  return {
    padding: "5px 11px",
    borderRadius: "var(--radius-pill)",
    border: active
      ? "1px solid var(--color-primary-muted)"
      : "1px solid var(--color-border)",
    background: active ? "var(--color-primary-light)" : "var(--color-bg-card)",
    color: active ? "var(--color-primary)" : "var(--color-text-secondary)",
    fontSize: 12,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    lineHeight: 1.2,
  };
}

type FilterStatus = "all" | "unread" | "bot_active" | "mine";

const MOCK_AGENTS = [
  { id: "agent-001", name: "Thu Hà" },
  { id: "agent-002", name: "Minh Tuấn" },
  { id: "agent-003", name: "Ngọc Anh" },
  { id: "agent-004", name: "Hoàng Nam" },
];

export function UnifiedInboxPage() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(MESSAGES);
  const [draft, setDraft] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showBotModal, setShowBotModal] = useState(false);
  const [customerPanelOpen, setCustomerPanelOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [hoveredBotMsgId, setHoveredBotMsgId] = useState<string | null>(null);
  const [aiDetailMsgId, setAiDetailMsgId] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;
  const threadMessages = selectedId ? (messages[selectedId] ?? []) : [];

  const filtered = conversations.filter((c) => {
    if (filterStatus === "unread" && c.unreadCount === 0) return false;
    if (filterStatus === "bot_active" && !c.botActive) return false;
    if (filterStatus === "mine" && c.assigneeId !== "agent-001") return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const target = [
        c.customer.name,
        c.lastMessage,
        c.customer.phone ?? "",
        c.customer.email ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!target.includes(q)) return false;
    }
    return true;
  });

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages.length, selectedId]);

  const [langflowReady, setLangflowReady] = useState(
    () =>
      typeof window !== "undefined" && !!customElements.get("langflow-chat"),
  );

  useEffect(() => {
    if (customElements.get("langflow-chat")) {
      setLangflowReady(true);
      return;
    }
    customElements
      .whenDefined("langflow-chat")
      .then(() => setLangflowReady(true));

    const existing = document.getElementById(
      LANGFLOW_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existing) return;

    const script = document.createElement("script");
    script.id = LANGFLOW_SCRIPT_ID;
    script.src = LANGFLOW_SCRIPT_SRC;
    script.async = true;
    script.onerror = () =>
      console.error("[Langflow] Failed to load chat widget script");
    document.body.appendChild(script);
  }, []);

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    setDraft("");
    setIsInternalNote(false);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  }

  function handleToggleBot() {
    if (!selected) return;
    if (selected.botActive) {
      setShowBotModal(true);
      return;
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, botActive: true, status: "bot_active" }
          : c,
      ),
    );
  }

  function handleConfirmToggleOff() {
    setShowBotModal(false);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              botActive: false,
              status: "agent_assigned",
              assigneeName: "Thu Hà",
            }
          : c,
      ),
    );
  }

  function handleSend() {
    if (!draft.trim() || !selectedId) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversationId: selectedId,
      senderType: "agent",
      senderName: "Thu Hà",
      content: draft.trim(),
      sentAt: "Vừa xong",
      deliveryStatus: "sending",
      isInternalNote,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, lastMessage: draft.trim(), lastMessageAt: "Vừa xong" }
          : c,
      ),
    );

    setDraft("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedId]: (prev[selectedId] ?? []).map((m) =>
          m.id === newMsg.id ? { ...m, deliveryStatus: "delivered" } : m,
        ),
      }));
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: "var(--color-bg-page)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 320,
          flexShrink: 0,
          borderRight: "1px solid var(--color-border)",
          background: "var(--color-bg-card)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            borderBottom: "1px solid var(--color-border)",
            display: "grid",
            gap: "var(--space-2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-text-primary)",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Hội thoại
              {totalUnread > 0 && (
                <span
                  style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                    borderRadius: "var(--radius-pill)",
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {totalUnread}
                </span>
              )}
            </h2>
          </div>

          <Input
            icon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên, nội dung, SĐT..."
          />

          <div style={{ display: "flex", gap: 4, flexWrap: "nowrap" }}>
            {(
              [
                { key: "all", label: "Tất cả" },
                { key: "unread", label: "Chưa đọc" },
                { key: "bot_active", label: "Bot bật" },
                { key: "mine", label: "Của tôi" },
              ] as { key: FilterStatus; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                style={{
                  ...getFilterButtonStyle(filterStatus === key),
                  padding: "4px 10px",
                  fontSize: 11.5,
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "var(--space-8) var(--space-4)",
                textAlign: "center",
              }}
            >
              <MessageSquare
                size={32}
                style={{
                  color: "var(--color-text-tertiary)",
                  marginBottom: "var(--space-3)",
                }}
              />
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-tertiary)",
                  margin: 0,
                }}
              >
                Không có hội thoại phù hợp.
              </p>
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setSearch("");
                }}
                style={{
                  marginTop: "var(--space-2)",
                  fontSize: 12,
                  color: "var(--color-primary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filtered.map((conv) => {
              const isSelected = conv.id === selectedId;
              return (
                <button
                  key={conv.id}
                  aria-selected={isSelected}
                  onClick={() => handleSelectConversation(conv.id)}
                  style={{
                    display: "flex",
                    width: "100%",
                    padding: "11px var(--space-4)",
                    border: "none",
                    borderBottom: "1px solid var(--color-border-ghost)",
                    background: isSelected
                      ? "var(--color-primary-light)"
                      : "transparent",
                    borderLeft: isSelected
                      ? "3px solid var(--color-primary)"
                      : "3px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "var(--space-3)",
                    alignItems: "flex-start",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--color-bg-page)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <Avatar name={conv.customer.name} size={36} />
                    <span
                      title={getChannelLabel(conv.channel)}
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: CHANNEL_META[conv.channel].chipBg,
                        border: `1.5px solid ${CHANNEL_META[conv.channel].chipBorder}`,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {CHANNEL_META[conv.channel].icon}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 6,
                        marginBottom: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: conv.unreadCount > 0 ? 700 : 600,
                            color: "var(--color-text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {conv.customer.name}
                        </span>
                        {conv.needsAttention && (
                          <span
                            style={{
                              padding: "1px 5px",
                              borderRadius: "var(--radius-pill)",
                              fontSize: 9,
                              fontWeight: 600,
                              background: "#FFF7ED",
                              color: "var(--color-warning)",
                              border: "1px solid #FCD9B6",
                              flexShrink: 0,
                              lineHeight: 1.3,
                            }}
                          >
                            {conv.attentionReason}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--color-text-tertiary)",
                          flexShrink: 0,
                        }}
                      >
                        {conv.lastMessageAt}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color:
                            conv.unreadCount > 0
                              ? "var(--color-text-primary)"
                              : "var(--color-text-secondary)",
                          fontWeight: conv.unreadCount > 0 ? 500 : 400,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {conv.lastMessage}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span
                          style={{
                            minWidth: 18,
                            height: 18,
                            borderRadius: "var(--radius-pill)",
                            background: "var(--color-primary)",
                            color: "#fff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 5px",
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {!selected ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-3)",
              color: "var(--color-text-tertiary)",
              padding: "var(--space-6)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--radius-full)",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                display: "grid",
                placeItems: "center",
                marginBottom: "var(--space-2)",
              }}
            >
              <MessageSquare size={28} />
            </div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                margin: 0,
              }}
            >
              Chọn một hội thoại
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-tertiary)",
                margin: 0,
                textAlign: "center",
                maxWidth: 260,
                lineHeight: 1.5,
              }}
            >
              Chọn hội thoại từ danh sách bên trái để xem tin nhắn và phản hồi
              khách hàng.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                padding: "12px var(--space-5)",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-bg-card)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
              }}
            >
              <Avatar name={selected.customer.name} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {selected.customer.name}
                </span>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-tertiary)",
                    margin: 0,
                  }}
                >
                  {selected.assigneeName
                    ? `Phân công: ${selected.assigneeName}`
                    : "Chưa phân công"}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  flexShrink: 0,
                }}
              >
                {/* Bot toggle switch */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Bot
                    size={15}
                    style={{
                      color: selected.botActive
                        ? "var(--color-primary)"
                        : "var(--color-text-tertiary)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: selected.botActive
                        ? "var(--color-primary)"
                        : "var(--color-text-secondary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Chatbot
                  </span>
                  <button
                    onClick={handleToggleBot}
                    aria-pressed={selected.botActive}
                    title={selected.botActive ? "Tắt chatbot" : "Bật chatbot"}
                    style={{
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      border: "none",
                      padding: 2,
                      cursor: "pointer",
                      background: selected.botActive
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                      transition: "background 0.2s",
                      display: "flex",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                        transition: "transform 0.2s",
                        transform: selected.botActive
                          ? "translateX(18px)"
                          : "translateX(0)",
                      }}
                    />
                  </button>
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: 1,
                    height: 24,
                    background: "var(--color-border)",
                    flexShrink: 0,
                  }}
                />

                {/* Agent assign (only when bot OFF) / Resolved button hidden when bot ON */}
                {!selected.botActive && selected.status !== "resolved" && (
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setShowAgentDropdown((v) => !v)}
                      style={{
                        ...outlineBtnStyle,
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <UserCheck size={14} />
                      {selected.assigneeName ?? "Chọn nhân viên xử lý"}
                      <ChevronDown size={13} />
                    </button>

                    {showAgentDropdown && (
                      <>
                        <div
                          style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9,
                          }}
                          onClick={() => setShowAgentDropdown(false)}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            right: 0,
                            zIndex: 10,
                            background: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-sm)",
                            boxShadow: "var(--shadow-dropdown)",
                            minWidth: 180,
                            padding: "4px 0",
                          }}
                        >
                          {MOCK_AGENTS.map((agent) => (
                            <button
                              key={agent.id}
                              onClick={() => {
                                setConversations((prev) =>
                                  prev.map((c) =>
                                    c.id === selectedId
                                      ? {
                                          ...c,
                                          assigneeId: agent.id,
                                          assigneeName: agent.name,
                                          status: "agent_assigned" as const,
                                        }
                                      : c,
                                  ),
                                );
                                setShowAgentDropdown(false);
                              }}
                              style={{
                                width: "100%",
                                padding: "8px 14px",
                                border: "none",
                                background:
                                  selected.assigneeId === agent.id
                                    ? "var(--color-primary-light)"
                                    : "transparent",
                                color:
                                  selected.assigneeId === agent.id
                                    ? "var(--color-primary)"
                                    : "var(--color-text-primary)",
                                fontSize: 13,
                                fontWeight:
                                  selected.assigneeId === agent.id ? 600 : 400,
                                textAlign: "left",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  selected.assigneeId === agent.id
                                    ? "var(--color-primary-light)"
                                    : "var(--color-bg-page)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  selected.assigneeId === agent.id
                                    ? "var(--color-primary-light)"
                                    : "transparent")
                              }
                            >
                              <Avatar name={agent.name} size={24} />
                              {agent.name}
                              {selected.assigneeId === agent.id && (
                                <Check
                                  size={14}
                                  style={{
                                    marginLeft: "auto",
                                    color: "var(--color-primary)",
                                  }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              role="log"
              aria-live="polite"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
                background: "var(--color-bg-page)",
              }}
            >
              {threadMessages.map((msg) => {
                const isBot = msg.senderType === "bot";
                const isAgent = msg.senderType === "agent";
                const isCustomer = msg.senderType === "customer";
                const isNote = msg.isInternalNote;

                const bubbleStyle: CSSProperties = isAgent
                  ? isNote
                    ? {
                        background: "#FEFCE8",
                        border: "1px solid #FDE68A",
                        color: "var(--color-text-primary)",
                      }
                    : {
                        background: "var(--color-primary-light)",
                        border: "1px solid var(--color-primary-muted)",
                        color: "var(--color-text-primary)",
                      }
                  : isBot
                    ? {
                        background: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                      }
                    : {
                        background: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                      };

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: isCustomer ? "row" : "row-reverse",
                      gap: "var(--space-2)",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      {isCustomer ? (
                        <Avatar name={msg.senderName} size={30} />
                      ) : isBot ? (
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "var(--radius-full)",
                            background: "var(--color-bg-surface)",
                            border: "1px solid var(--color-border)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <Bot size={15} color="var(--color-primary)" />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "var(--radius-full)",
                            background: "var(--color-primary-light)",
                            border: "1px solid var(--color-primary-muted)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <User size={14} color="var(--color-primary)" />
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        maxWidth: "70%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        alignItems: isCustomer ? "flex-start" : "flex-end",
                      }}
                      onMouseEnter={() => {
                        if (isBot) setHoveredBotMsgId(msg.id);
                      }}
                      onMouseLeave={() => {
                        if (isBot) setHoveredBotMsgId(null);
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: isCustomer
                            ? "var(--radius-sm) var(--radius-sm) var(--radius-sm) 4px"
                            : "var(--radius-sm) var(--radius-sm) 4px var(--radius-sm)",
                          fontSize: 13.5,
                          lineHeight: 1.55,
                          ...bubbleStyle,
                        }}
                      >
                        {msg.content}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 10,
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {isBot && (
                          <span
                            style={{
                              color: "var(--color-primary)",
                              fontWeight: 600,
                            }}
                          >
                            Bot AI
                          </span>
                        )}
                        {isAgent && (
                          <span
                            style={{
                              color: "var(--color-text-secondary)",
                              fontWeight: 600,
                            }}
                          >
                            {isNote ? "Ghi chú nội bộ" : msg.senderName}
                          </span>
                        )}
                        <span>{msg.sentAt}</span>
                        {isAgent && !isNote && (
                          <DeliveryIcon status={msg.deliveryStatus} />
                        )}

                        {/* Info icon for bot messages on hover */}
                        {isBot && hoveredBotMsgId === msg.id && (
                          <button
                            onClick={() => setAiDetailMsgId(msg.id)}
                            title="Xem chi tiết AI"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--color-primary)",
                              padding: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                              fontWeight: 500,
                              opacity: 0.85,
                              transition: "opacity 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.opacity = "1")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.opacity = "0.85")
                            }
                          >
                            <Info size={12} />
                            Chi tiết
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={threadEndRef} />
            </div>

            {selected.status === "unassigned" && (
              <div
                style={{
                  padding: "10px var(--space-5)",
                  background: "#FFF7ED",
                  borderTop: "1px solid #FCD9B6",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <AlertCircle size={16} color="var(--color-warning)" />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    flex: 1,
                  }}
                >
                  Hội thoại chưa được phân công.
                </span>
                <button
                  style={{
                    ...outlineBtnStyle,
                    padding: "5px 12px",
                    fontSize: 12,
                  }}
                >
                  Nhận xử lý
                </button>
              </div>
            )}

            {selected.status !== "resolved" ? (
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderTop: isInternalNote
                    ? "2px solid #FDE68A"
                    : "1px solid var(--color-border)",
                  background: isInternalNote
                    ? "#FFFEF5"
                    : "var(--color-bg-card)",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  <button
                    onClick={() => setIsInternalNote(false)}
                    style={{
                      ...getFilterButtonStyle(!isInternalNote),
                      padding: "4px 10px",
                      fontSize: 11.5,
                    }}
                  >
                    Tin nhắn
                  </button>
                  <button
                    onClick={() => setIsInternalNote(true)}
                    style={{
                      ...(isInternalNote
                        ? {
                            ...getFilterButtonStyle(true),
                            background: "#FEF9C3",
                            borderColor: "#FDE68A",
                            color: "#92400E",
                          }
                        : getFilterButtonStyle(false)),
                      padding: "4px 10px",
                      fontSize: 11.5,
                    }}
                  >
                    Ghi chú nội bộ
                  </button>
                  {isInternalNote && (
                    <span
                      style={{
                        fontSize: 10.5,
                        color: "#92400E",
                        fontWeight: 500,
                        marginLeft: "auto",
                      }}
                    >
                      Không gửi cho khách
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "var(--space-2)",
                    border: isInternalNote
                      ? "1px solid #FDE68A"
                      : "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "8px 12px",
                    background: isInternalNote
                      ? "#FEFCE8"
                      : "var(--color-bg-card)",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isInternalNote
                        ? "Ghi chú nội bộ (không gửi cho khách)..."
                        : "Nhập tin nhắn..."
                    }
                    rows={1}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      resize: "none",
                      fontSize: 13.5,
                      color: "var(--color-text-primary)",
                      background: "transparent",
                      lineHeight: 1.5,
                      maxHeight: 120,
                      overflowY: "auto",
                      fontFamily: "var(--font-primary)",
                    }}
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = "auto";
                      t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-2)",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <button
                      title="Đính kèm"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-text-secondary)",
                        display: "flex",
                        padding: 4,
                      }}
                    >
                      <Paperclip size={16} />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!draft.trim()}
                      title="Gửi (Enter)"
                      aria-label="Gửi tin nhắn"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "var(--radius-full)",
                        border: "none",
                        background: draft.trim()
                          ? "var(--color-primary)"
                          : "var(--color-bg-surface)",
                        color: draft.trim()
                          ? "#fff"
                          : "var(--color-text-tertiary)",
                        display: "grid",
                        placeItems: "center",
                        cursor: draft.trim() ? "pointer" : "default",
                        transition: "background 0.15s",
                        flexShrink: 0,
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "var(--space-4) var(--space-5)",
                  borderTop: "1px solid var(--color-border)",
                  background: "var(--color-bg-surface)",
                  textAlign: "center",
                }}
              >
                <span
                  style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}
                >
                  Hội thoại đã được xử lý.
                </span>
                <button
                  style={{
                    marginLeft: "var(--space-2)",
                    fontSize: 13,
                    color: "var(--color-primary)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() =>
                    setConversations((prev) =>
                      prev.map((c) =>
                        c.id === selectedId
                          ? { ...c, status: "unassigned" }
                          : c,
                      ),
                    )
                  }
                >
                  Mở lại
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <div
          style={{
            width: customerPanelOpen ? 284 : 48,
            flexShrink: 0,
            borderLeft: "1px solid var(--color-border)",
            background: "var(--color-bg-card)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "width 220ms ease",
          }}
        >
          <button
            onClick={() => setCustomerPanelOpen((v) => !v)}
            aria-label={
              customerPanelOpen
                ? "Thu gọn thông tin khách"
                : "Mở rộng thông tin khách"
            }
            style={{
              padding: "var(--space-3)",
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: customerPanelOpen ? "space-between" : "center",
              borderBottom: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
              flexShrink: 0,
            }}
          >
            {customerPanelOpen && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--color-text-tertiary)",
                }}
              >
                Thông tin khách hàng
              </span>
            )}
            {customerPanelOpen ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {customerPanelOpen && (
            <div
              style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)" }}
            >
              <div
                style={{ textAlign: "center", marginBottom: "var(--space-4)" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  <Avatar name={selected.customer.name} size={58} />
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {selected.customer.name}
                </div>
                <StageBadge stage={selected.customer.stage} />
              </div>

              {selected.customer.leadScore !== undefined && (
                <div
                  style={{
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-primary-light)",
                    border: "1px solid var(--color-primary-muted)",
                    marginBottom: "var(--space-4)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "var(--color-primary)",
                    }}
                  >
                    {selected.customer.leadScore}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                      fontWeight: 500,
                    }}
                  >
                    Điểm tiềm năng —{" "}
                    {selected.customer.leadClassification === "hot"
                      ? "Cao"
                      : selected.customer.leadClassification === "warm"
                        ? "Trung bình"
                        : "Thấp"}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "var(--space-4)" }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--color-text-tertiary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Liên hệ
                </div>
                {selected.customer.phone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      marginBottom: "var(--space-1)",
                      fontSize: 13,
                    }}
                  >
                    <Phone size={13} color="var(--color-text-tertiary)" />
                    <span style={{ color: "var(--color-text-primary)" }}>
                      {selected.customer.phone}
                    </span>
                  </div>
                )}
                {selected.customer.email && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      marginBottom: "var(--space-1)",
                      fontSize: 13,
                    }}
                  >
                    <Mail size={13} color="var(--color-text-tertiary)" />
                    <span style={{ color: "var(--color-text-primary)" }}>
                      {selected.customer.email}
                    </span>
                  </div>
                )}
                {!selected.customer.phone && !selected.customer.email && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-tertiary)",
                      margin: 0,
                    }}
                  >
                    Chưa có thông tin liên hệ
                  </p>
                )}
              </div>

              {selected.customer.tags.length > 0 && (
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "var(--color-text-tertiary)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    Tags
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selected.customer.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "2px 8px",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--color-bg-surface)",
                          color: "var(--color-text-secondary)",
                          fontSize: 11,
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {tag.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <button
                  onClick={() => setHistoryOpen((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "var(--space-2)",
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "var(--color-text-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <History size={11} />
                    Lịch sử liên lạc ({selected.customer.channelHistory.length})
                  </span>
                  {historyOpen ? (
                    <ChevronDown size={13} color="var(--color-text-tertiary)" />
                  ) : (
                    <ChevronRight
                      size={13}
                      color="var(--color-text-tertiary)"
                    />
                  )}
                </button>

                {historyOpen &&
                  selected.customer.channelHistory.map((h, i) => (
                    <div
                      key={`${h.channel}-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        marginBottom: "var(--space-1)",
                        fontSize: 12,
                      }}
                    >
                      <ChannelIcon channel={h.channel} />
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {getChannelLabel(h.channel)}
                      </span>
                      <span
                        style={{
                          color: "var(--color-text-tertiary)",
                          marginLeft: "auto",
                        }}
                      >
                        {h.lastContact}
                      </span>
                    </div>
                  ))}
              </div>

              <div
                style={{
                  marginTop: "var(--space-4)",
                  paddingTop: "var(--space-4)",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    Tệp đính kèm (0)
                  </span>
                  <ChevronRight size={13} color="var(--color-text-tertiary)" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showBotModal && (
        <BotToggleModal
          onConfirm={handleConfirmToggleOff}
          onCancel={() => setShowBotModal(false)}
        />
      )}

      {aiDetailMsgId && (
        <AiDetailPopup onClose={() => setAiDetailMsgId(null)} />
      )}

      {langflowReady &&
        createPortal(
          <div
          // style={{
          //   position: "fixed",
          //   left: 24,
          //   bottom: 24,
          //   zIndex: 9999,
          //   pointerEvents: "auto",
          // }}
          >
            <langflow-chat
              window_title="Haravan chatbot"
              flow_id="22c07722-072f-437c-a782-90e7d813f2ac"
              host_url="https://flow.aaronnnguyen.me"
              api_key="sk-6U8V_o8XbVgM3zTiueJGfyzZa13QSkDXVk4JXj_XU1g"
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
