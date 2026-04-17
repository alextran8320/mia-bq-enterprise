import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";
import {
  AlertCircle,
  Bot,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Globe,
  History,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Paperclip,
  Phone,
  Search,
  Send,
  User,
  UserCheck,
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
    icon: <MessageCircle size={12} color="#1D4ED8" />,
    chipBg: "#EFF6FF",
    chipText: "#1E40AF",
    chipBorder: "#BFDBFE",
  },
  zalo: {
    icon: <MessageSquare size={12} color="#1D4ED8" />,
    chipBg: "#EEF2FF",
    chipText: "#1E3A8A",
    chipBorder: "#C7D2FE",
  },
  instagram: {
    icon: <MessageCircle size={12} color="#9D174D" />,
    chipBg: "#FDF2F8",
    chipText: "#9D174D",
    chipBorder: "#FBCFE8",
  },
  web: {
    icon: <Globe size={12} color="#0F766E" />,
    chipBg: "#ECFEFF",
    chipText: "#115E59",
    chipBorder: "#99F6E4",
  },
};

function ChannelIcon({ channel }: { channel: Channel }) {
  return CHANNEL_META[channel].icon;
}

function ChannelChip({ channel }: { channel: Channel }) {
  const meta = CHANNEL_META[channel];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        borderRadius: "var(--radius-pill)",
        background: meta.chipBg,
        color: meta.chipText,
        border: `1px solid ${meta.chipBorder}`,
        fontSize: 10.5,
        fontWeight: 600,
        lineHeight: 1.2,
        flexShrink: 0,
      }}
    >
      <ChannelIcon channel={channel} />
      {getChannelLabel(channel)}
    </span>
  );
}

function StageBadge({ stage }: { stage: Conversation["customer"]["stage"] }) {
  const palette =
    stage === "customer"
      ? { color: "var(--color-success)", bg: "#F0FDF4", border: "#BBF7D0" }
      : stage === "qualified"
      ? { color: "var(--color-primary)", bg: "var(--color-primary-light)", border: "var(--color-primary-muted)" }
      : { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)", border: "var(--color-border)" };

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
        style={{ color: "var(--color-text-tertiary)", animation: "spin 1s linear infinite" }}
      />
    );
  }
  if (status === "failed") return <AlertCircle size={12} style={{ color: "var(--color-error)" }} />;
  if (status === "read") return <CheckCheck size={12} style={{ color: "var(--color-primary)" }} />;
  if (status === "delivered") return <CheckCheck size={12} style={{ color: "var(--color-text-tertiary)" }} />;
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
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)", margin: 0 }}>
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
          Bot sẽ dừng tự động trả lời trong hội thoại này. Bạn sẽ tiếp tục xử lý trực tiếp với khách hàng.
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
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

function getFilterButtonStyle(active: boolean): CSSProperties {
  return {
    padding: "5px 11px",
    borderRadius: "var(--radius-pill)",
    border: active ? "1px solid var(--color-primary-muted)" : "1px solid var(--color-border)",
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

type FilterChannel = "all" | Channel;
type FilterStatus = "all" | "unread" | "bot_active" | "mine";

export function UnifiedInboxPage() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterChannel, setFilterChannel] = useState<FilterChannel>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(MESSAGES);
  const [draft, setDraft] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showBotModal, setShowBotModal] = useState(false);
  const [customerPanelOpen, setCustomerPanelOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);

  const threadEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;
  const threadMessages = selectedId ? (messages[selectedId] ?? []) : [];

  const filtered = conversations.filter((c) => {
    if (filterChannel !== "all" && c.channel !== filterChannel) return false;
    if (filterStatus === "unread" && c.unreadCount === 0) return false;
    if (filterStatus === "bot_active" && !c.botActive) return false;
    if (filterStatus === "mine" && c.assigneeId !== "agent-001") return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const target = [c.customer.name, c.lastMessage, c.customer.phone ?? "", c.customer.email ?? ""]
        .join(" ")
        .toLowerCase();
      if (!target.includes(q)) return false;
    }
    return true;
  });

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages.length, selectedId]);

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    setDraft("");
    setIsInternalNote(false);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)));
  }

  function handleToggleBot() {
    if (!selected) return;
    if (selected.botActive) {
      setShowBotModal(true);
      return;
    }
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, botActive: true, status: "bot_active" } : c)),
    );
  }

  function handleConfirmToggleOff() {
    setShowBotModal(false);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, botActive: false, status: "agent_assigned", assigneeName: "Thu Hà" }
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
        c.id === selectedId ? { ...c, lastMessage: draft.trim(), lastMessageAt: "Vừa xong" } : c,
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

  function handleResolve() {
    if (!selectedId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, status: "resolved", unreadCount: 0 } : c)),
    );
    setSelectedId(null);
  }

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--color-bg-page)", overflow: "hidden" }}>
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
            padding: "var(--space-4)",
            borderBottom: "1px solid var(--color-border)",
            display: "grid",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2
              style={{
                fontSize: 16,
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
            icon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên khách, nội dung, SĐT..."
          />

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["all", "facebook", "zalo", "instagram", "web"] as FilterChannel[]).map((ch) => (
              <button key={ch} onClick={() => setFilterChannel(ch)} style={getFilterButtonStyle(filterChannel === ch)}>
                {ch === "all" ? "Tất cả kênh" : (
                  <>
                    <ChannelIcon channel={ch as Channel} />
                    {getChannelLabel(ch as Channel)}
                  </>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {([
              { key: "all", label: "Tất cả" },
              { key: "unread", label: "Chưa đọc" },
              { key: "bot_active", label: "Bot đang bật" },
              { key: "mine", label: "Của tôi" },
            ] as { key: FilterStatus; label: string }[]).map(({ key, label }) => (
              <button key={key} onClick={() => setFilterStatus(key)} style={getFilterButtonStyle(filterStatus === key)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "var(--space-8) var(--space-4)", textAlign: "center" }}>
              <MessageSquare
                size={32}
                style={{ color: "var(--color-text-tertiary)", marginBottom: "var(--space-3)" }}
              />
              <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: 0 }}>
                Không có hội thoại phù hợp.
              </p>
              <button
                onClick={() => {
                  setFilterChannel("all");
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
                    background: isSelected ? "var(--color-primary-light)" : "transparent",
                    borderLeft: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "var(--space-3)",
                    alignItems: "flex-start",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-page)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <Avatar name={conv.customer.name} size={38} />
                    {conv.botActive && (
                      <span
                        title="Bot đang bật"
                        style={{
                          position: "absolute",
                          bottom: -1,
                          right: -1,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "var(--color-success)",
                          border: "2px solid var(--color-bg-card)",
                        }}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 6,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conv.customer.name}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", flexShrink: 0 }}>
                        {conv.lastMessageAt}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <ChannelChip channel={conv.channel} />
                      {conv.needsAttention && (
                        <span
                          style={{
                            padding: "1px 6px",
                            borderRadius: "var(--radius-pill)",
                            fontSize: 10,
                            fontWeight: 600,
                            background: "#FFF7ED",
                            color: "var(--color-warning)",
                            border: "1px solid #FCD9B6",
                          }}
                        >
                          {conv.attentionReason}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--color-text-secondary)",
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
                            minWidth: 20,
                            height: 20,
                            borderRadius: "var(--radius-pill)",
                            background: "var(--color-primary)",
                            color: "#fff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 6px",
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {!selected ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-4)",
              color: "var(--color-text-tertiary)",
            }}
          >
            <MessageSquare size={42} />
            <p style={{ fontSize: 14, margin: 0 }}>Chọn một hội thoại để bắt đầu</p>
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
              <Avatar name={selected.customer.name} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {selected.customer.name}
                  </span>
                  <ChannelChip channel={selected.channel} />
                  <StageBadge stage={selected.customer.stage} />
                </div>
                <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: 0 }}>
                  {selected.assigneeName ? `Phân công: ${selected.assigneeName}` : "Chưa phân công"}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {selected.botActive && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      color: "var(--color-primary)",
                      fontWeight: 600,
                      padding: "5px 9px",
                      borderRadius: "var(--radius-pill)",
                      background: "var(--color-primary-light)",
                      border: "1px solid var(--color-primary-muted)",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--color-success)",
                        display: "inline-block",
                      }}
                    />
                    Chatbot đang hoạt động
                  </span>
                )}

                <button
                  onClick={handleToggleBot}
                  aria-pressed={selected.botActive}
                  title={selected.botActive ? "Tắt chatbot" : "Bật chatbot"}
                  style={{
                    ...outlineBtnStyle,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: selected.botActive ? "var(--color-primary-light)" : "var(--color-bg-card)",
                    borderColor: selected.botActive ? "var(--color-primary-muted)" : "var(--color-border)",
                    color: selected.botActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                  }}
                >
                  <Bot size={14} />
                  {selected.botActive ? "Tắt bot" : "Bật bot"}
                </button>

                {selected.status !== "resolved" && (
                  <button onClick={handleResolve} style={{ ...outlineBtnStyle, fontSize: 12, padding: "6px 12px" }}>
                    <UserCheck size={14} style={{ marginRight: 4 }} />
                    Đã xử lý
                  </button>
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
                        {isBot && <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>Bot AI</span>}
                        {isAgent && (
                          <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
                            {isNote ? "Ghi chú nội bộ" : msg.senderName}
                          </span>
                        )}
                        <span>{msg.sentAt}</span>
                        {isAgent && !isNote && <DeliveryIcon status={msg.deliveryStatus} />}
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
                <span style={{ fontSize: 13, color: "var(--color-text-secondary)", flex: 1 }}>
                  Hội thoại chưa được phân công.
                </span>
                <button style={{ ...outlineBtnStyle, padding: "5px 12px", fontSize: 12 }}>
                  Nhận xử lý
                </button>
              </div>
            )}

            {selected.status !== "resolved" ? (
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderTop: "1px solid var(--color-border)",
                  background: "var(--color-bg-card)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
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
                      ...getFilterButtonStyle(isInternalNote),
                      padding: "4px 10px",
                      fontSize: 11.5,
                    }}
                  >
                    Ghi chú nội bộ
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "var(--space-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "8px 12px",
                    background: "var(--color-bg-card)",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isInternalNote ? "Ghi chú nội bộ (không gửi cho khách)..." : "Nhập tin nhắn..."}
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
                  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexShrink: 0 }}>
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
                        background: draft.trim() ? "var(--color-primary)" : "var(--color-bg-surface)",
                        color: draft.trim() ? "#fff" : "var(--color-text-tertiary)",
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
                <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>Hội thoại đã được xử lý.</span>
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
                      prev.map((c) => (c.id === selectedId ? { ...c, status: "unassigned" } : c)),
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
            aria-label={customerPanelOpen ? "Thu gọn thông tin khách" : "Mở rộng thông tin khách"}
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
            {customerPanelOpen ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>

          {customerPanelOpen && (
            <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)" }}>
              <div style={{ textAlign: "center", marginBottom: "var(--space-4)" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-2)" }}>
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
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--color-primary)" }}>
                    {selected.customer.leadScore}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 }}>
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
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)", fontSize: 13 }}>
                    <Phone size={13} color="var(--color-text-tertiary)" />
                    <span style={{ color: "var(--color-text-primary)" }}>{selected.customer.phone}</span>
                  </div>
                )}
                {selected.customer.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)", fontSize: 13 }}>
                    <Mail size={13} color="var(--color-text-tertiary)" />
                    <span style={{ color: "var(--color-text-primary)" }}>{selected.customer.email}</span>
                  </div>
                )}
                {!selected.customer.phone && !selected.customer.email && (
                  <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0 }}>Chưa có thông tin liên hệ</p>
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
                    <ChevronRight size={13} color="var(--color-text-tertiary)" />
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
                      <span style={{ color: "var(--color-text-secondary)" }}>{getChannelLabel(h.channel)}</span>
                      <span style={{ color: "var(--color-text-tertiary)", marginLeft: "auto" }}>{h.lastContact}</span>
                    </div>
                  ))}
              </div>

              <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

      {showBotModal && <BotToggleModal onConfirm={handleConfirmToggleOff} onCancel={() => setShowBotModal(false)} />}
    </div>
  );
}
