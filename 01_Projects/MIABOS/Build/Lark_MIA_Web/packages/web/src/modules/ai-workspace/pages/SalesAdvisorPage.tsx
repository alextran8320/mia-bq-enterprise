import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  DISCOVERY_STEPS,
  SALES_ADVISOR_SCENARIOS,
  SalesAdvisorScenario,
  getAvailabilityCopy,
} from "@/mocks/ai-workspace/salesAdvisor";

type ThreadItem =
  | AssistantThreadItem
  | { id: string; role: "user"; text: string }
  | { id: string; role: "success"; text: string };

type AssistantThreadItem = { id: string; role: "assistant"; text: string; scenario?: SalesAdvisorScenario };

const initialThread: ThreadItem[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Xin chào! Tôi có thể giúp bạn tìm giày phù hợp. Bạn đang tìm kiểu giày gì?",
  },
];

function availabilityTone(confidence: "high" | "medium" | "low") {
  if (confidence === "high") {
    return { color: "var(--color-success)", bg: "color-mix(in srgb, var(--color-success) 12%, white)" };
  }

  if (confidence === "medium") {
    return { color: "var(--color-warning)", bg: "color-mix(in srgb, var(--color-warning) 14%, white)" };
  }

  return { color: "var(--color-text-secondary)", bg: "var(--color-primary-light)" };
}

function UserBubble({ text }: { text: string }) {
  return (
    <div
      style={{
        maxWidth: 520,
        marginLeft: "auto",
        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
        color: "white",
        padding: "14px 18px",
        borderRadius: "12px 12px 4px 12px",
        boxShadow: "var(--shadow-ambient)",
        fontSize: 14,
      }}
    >
      {text}
    </div>
  );
}

function AssistantBubble({ item, onLeadCapture }: { item: AssistantThreadItem | { id: string; role: "success"; text: string }; onLeadCapture: () => void }) {
  if (item.role === "success") {
    return (
      <div
        style={{
          maxWidth: 520,
          display: "flex",
          gap: "var(--space-3)",
          alignItems: "center",
          background: "color-mix(in srgb, var(--color-success) 12%, white)",
          color: "var(--color-text-primary)",
          padding: "14px 18px",
          borderRadius: "12px 12px 12px 4px",
          boxShadow: "var(--shadow-ambient)",
        }}
      >
        <CheckCircle2 size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
        <span>{item.text}</span>
      </div>
    );
  }

  const scenario = item.scenario;

  return (
    <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: "start" }}>
      <div
        role={scenario?.kind === "blocked" ? "alert" : undefined}
        style={{
          maxWidth: 620,
          display: "flex",
          gap: "var(--space-3)",
          alignItems: "flex-start",
          background: scenario?.kind === "blocked" ? "color-mix(in srgb, var(--color-error) 10%, white)" : "var(--color-bg-surface)",
          color: "var(--color-text-primary)",
          padding: "14px 18px",
          borderRadius: "12px 12px 12px 4px",
          boxShadow: "var(--shadow-ambient)",
          fontSize: 14,
        }}
      >
        {scenario?.kind === "blocked" ? (
          <AlertTriangle size={18} style={{ color: "var(--color-error)", flexShrink: 0, marginTop: 2 }} />
        ) : (
          <Bot size={18} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 2 }} />
        )}
        <span>{item.text}</span>
      </div>

      {scenario?.warning ? (
        <div
          role="alert"
          style={{
            maxWidth: 620,
            display: "flex",
            gap: "var(--space-2)",
            alignItems: "flex-start",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            background: "color-mix(in srgb, var(--color-warning) 14%, white)",
            color: "var(--color-text-primary)",
            fontSize: 13,
          }}
        >
          <AlertTriangle size={15} style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 2 }} />
          {scenario.warning}
        </div>
      ) : null}

      {scenario?.suggestions.length ? (
        <div style={{ display: "grid", gap: "var(--space-4)", width: "min(100%, 760px)" }}>
          {scenario.suggestions.map((suggestion) => {
            const tone = availabilityTone(suggestion.availabilityConfidence);
            return (
              <Card
                key={suggestion.id}
                style={{
                  padding: "var(--space-4)",
                  display: "grid",
                  gridTemplateColumns: "96px 1fr",
                  gap: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <img
                  src={suggestion.imageUrl}
                  alt={suggestion.name}
                  style={{
                    width: 96,
                    height: 96,
                    objectFit: "cover",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-primary-light)",
                  }}
                />
                <div style={{ display: "grid", gap: "var(--space-3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
                    <div>
                      <h3>{suggestion.name}</h3>
                      <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>{suggestion.rationale}</p>
                    </div>
                    <strong style={{ whiteSpace: "nowrap", color: "var(--color-text-primary)" }}>
                      {suggestion.priceBand}
                    </strong>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {suggestion.promoNote ? <Badge label={suggestion.promoNote} /> : null}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        padding: "6px 10px",
                        borderRadius: "var(--radius-pill)",
                        background: tone.bg,
                        color: tone.color,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      <PackageCheck size={14} />
                      {getAvailabilityCopy(suggestion)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {scenario ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {scenario.ctaOptions.map((cta) => (
            <Button
              key={cta}
              variant={cta === "Để lại thông tin" || cta === "Gặp nhân viên tư vấn" ? "primary" : "secondary"}
              onClick={cta === "Để lại thông tin" ? onLeadCapture : undefined}
              style={{ padding: "10px 16px" }}
            >
              {cta === "Để lại thông tin" ? <Phone size={15} /> : <ArrowRight size={15} />}
              {cta}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DiscoveryPanel({ onSelectScenario }: { onSelectScenario: (scenario: SalesAdvisorScenario) => void }) {
  return (
    <Card style={{ display: "grid", gap: "var(--space-5)", borderRadius: "var(--radius-md)" }}>
      <div>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: 11, fontWeight: 500, textTransform: "uppercase" }}>
          Bắt đầu tư vấn
        </p>
        <h2>Khách đang tìm gì?</h2>
      </div>

      {DISCOVERY_STEPS.map((step, index) => (
        <div key={step.question} style={{ display: "grid", gap: "var(--space-2)" }}>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
            {index + 1}. {step.question}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {step.options.map((option) => (
              <button
                key={option}
                type="button"
                style={{
                  border: "1px solid var(--color-border-ghost)",
                  background: "white",
                  color: "var(--color-primary)",
                  borderRadius: "var(--radius-pill)",
                  padding: "9px 12px",
                  fontFamily: "var(--font-primary)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "background 0.15s, border-color 0.15s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-light)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-primary)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "white";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border-ghost)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "grid", gap: "var(--space-2)" }}>
        {SALES_ADVISOR_SCENARIOS.map((scenario) => (
          <button
            key={scenario.kind}
            type="button"
            onClick={() => onSelectScenario(scenario)}
            style={{
              border: "1px solid transparent",
              background: "var(--color-primary-light)",
              color: "var(--color-text-primary)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              fontFamily: "var(--font-primary)",
              textAlign: "left",
              cursor: "pointer",
              fontSize: 13,
              lineHeight: 1.5,
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#dde8ff";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(47,100,246,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-light)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
            }}
          >
            {scenario.userPrompt}
          </button>
        ))}
      </div>
    </Card>
  );
}

function LeadCaptureForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 9) {
      setError("Bạn nhập tên và số điện thoại hợp lệ nhé.");
      return;
    }
    onSubmit(name.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "min(100%, 520px)",
        display: "grid",
        gap: "var(--space-3)",
        background: "white",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        boxShadow: "var(--shadow-ambient)",
      }}
    >
      <p style={{ fontWeight: 600 }}>Để nhân viên liên hệ tư vấn thêm, bạn để lại thông tin nhé:</p>
      <label style={{ display: "grid", gap: "var(--space-1)", color: "var(--color-text-secondary)", fontSize: 13 }}>
        Tên của bạn
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{
            border: "1px solid var(--color-border-ghost)",
            borderRadius: "var(--radius-sm)",
            padding: "12px",
            font: "inherit",
            color: "var(--color-text-primary)",
          }}
        />
      </label>
      <label style={{ display: "grid", gap: "var(--space-1)", color: "var(--color-text-secondary)", fontSize: 13 }}>
        Số điện thoại
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          style={{
            border: "1px solid var(--color-border-ghost)",
            borderRadius: "var(--radius-sm)",
            padding: "12px",
            font: "inherit",
            color: "var(--color-text-primary)",
          }}
        />
      </label>
      {error ? (
        <div role="alert" style={{ color: "var(--color-error)", fontSize: 13 }}>
          {error}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <Button type="submit">
          <Send size={15} />
          Gửi thông tin
        </Button>
        <Button type="button" variant="tertiary" onClick={() => onSubmit("")}>
          Thôi, để sau
        </Button>
      </div>
    </form>
  );
}

export function SalesAdvisorPage() {
  const [thread, setThread] = useState<ThreadItem[]>(initialThread);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const selectedScenario = useMemo(() => {
    const assistantItem = thread.find((item): item is AssistantThreadItem => item.role === "assistant" && Boolean(item.scenario));
    return assistantItem?.scenario;
  }, [thread]);

  function sendScenario(scenario: SalesAdvisorScenario) {
    setShowLeadForm(false);
    setThread([
      ...initialThread,
      { id: `user-${scenario.kind}`, role: "user", text: scenario.userPrompt },
      { id: `assistant-${scenario.kind}`, role: "assistant", text: scenario.assistantIntro, scenario },
    ]);
  }

  function handleLeadSubmit(name: string) {
    setShowLeadForm(false);
    setThread((current) => [
      ...current,
      {
        id: `success-${Date.now()}`,
        role: "success",
        text: name ? `Đã ghi nhận, ${name}! Nhân viên sẽ liên hệ bạn sớm.` : "Không sao, mình vẫn có thể tư vấn thêm khi bạn cần.",
      },
    ]);
  }

  return (
    <div style={{ display: "grid", gap: "var(--space-6)" }}>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-6)",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: 11, fontWeight: 500, textTransform: "uppercase" }}>
            AI Workspace
          </p>
          <h1>Tư Vấn Giày BQ</h1>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: 680 }}>
            Khách nhận gợi ý sản phẩm, range giá, ưu đãi an toàn và CTA sau tối đa 3 câu hỏi làm rõ.
          </p>
        </div>
        <Badge label="FE Preview" />
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: "var(--space-6)" }}>
        <Card
          style={{
            minHeight: 620,
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            gap: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "var(--space-5) var(--space-6)",
              background: "var(--color-bg-card)",
              boxShadow: "var(--shadow-ambient)",
            }}
          >
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                }}
              >
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2>Tư Vấn Giày BQ</h2>
                <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
                  {selectedScenario?.kind === "blocked" ? "Đang bảo vệ thông tin nhạy cảm" : "Sẵn sàng tư vấn sản phẩm"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", color: "var(--color-text-secondary)" }}>
              <MessageCircle size={16} />
              <span style={{ fontSize: 13 }}>Mock data</span>
            </div>
          </div>

          <div style={{ padding: "var(--space-6)", display: "grid", alignContent: "start", gap: "var(--space-4)" }}>
            {thread.map((item) =>
              item.role === "user" ? (
                <UserBubble key={item.id} text={item.text} />
              ) : (
                <AssistantBubble key={item.id} item={item} onLeadCapture={() => setShowLeadForm(true)} />
              ),
            )}
            {showLeadForm ? <LeadCaptureForm onSubmit={handleLeadSubmit} /> : null}
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              alignItems: "center",
              padding: "10px 10px 10px 16px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <UserRound size={18} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
            <input
              placeholder="Nhập câu hỏi hoặc mô tả nhu cầu..."
              aria-label="Nhập câu hỏi tư vấn"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                font: "inherit",
                fontSize: 13,
                color: "var(--color-text-primary)",
              }}
            />
            <Button
              aria-label="Gửi"
              style={{
                padding: "10px 16px",
                borderRadius: "var(--radius-pill)",
              }}
            >
              <Send size={16} />
            </Button>
          </div>
        </Card>

        <aside style={{ display: "grid", gap: "var(--space-4)", alignContent: "start" }}>
          <DiscoveryPanel onSelectScenario={sendScenario} />
          <Card style={{ display: "grid", gap: "var(--space-3)", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Sparkles size={18} style={{ color: "var(--color-primary)" }} />
              <h3>Quy tắc an toàn</h3>
            </div>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
              Không hiển thị số tồn kho, giá nội bộ hoặc dữ liệu không public-safe. Khi confidence thấp, luôn chuyển sang xác nhận với nhân viên.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
