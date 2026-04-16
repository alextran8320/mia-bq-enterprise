import { Link } from "react-router-dom";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileWarning,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";
import {
  aiRoiKpis,
  branchMetrics,
  dashboardStates,
  executiveKpis,
  funnelStages,
  performanceKpis,
  promoMetrics,
  type DashboardView,
  type KpiCardData,
  type MetricTone,
} from "@/mocks/analytics/dashboard";
import { Badge, Button, Card } from "@/shared/ui";

interface BusinessAnalyticsPageProps {
  view: DashboardView;
}

const viewConfig: Record<DashboardView, { title: string; label: string; description: string }> = {
  executive: {
    title: "Tổng Quan Điều Hành",
    label: "Insights & Performance",
    description: "Top KPI cho lãnh đạo BQ, dùng mock snapshot để review hierarchy và trạng thái dashboard.",
  },
  performance: {
    title: "Hiệu Quả Kinh Doanh",
    label: "Business Performance",
    description: "Sell-through, hiệu quả CTKM và so sánh chi nhánh/kênh bằng dữ liệu preview.",
  },
  funnel: {
    title: "Phễu Chuyển Đổi & CRM",
    label: "CRM & Funnel",
    description: "Funnel từ lead capture đến converted, kèm segment/campaign mock để review thao tác.",
  },
  "ai-roi": {
    title: "ROI & Hiệu Quả AI",
    label: "AI ROI",
    description: "Tín hiệu AI success, escalation, lead capture và thời gian tiết kiệm cho báo cáo pilot.",
  },
};

const tabs: Array<{ to: string; label: string; view: DashboardView }> = [
  { to: "/analytics/executive", label: "Tổng quan", view: "executive" },
  { to: "/analytics/performance", label: "Hiệu quả kinh doanh", view: "performance" },
  { to: "/analytics/funnel", label: "Phễu & CRM", view: "funnel" },
  { to: "/analytics/ai-roi", label: "ROI AI", view: "ai-roi" },
];

const toneColor: Record<MetricTone, string> = {
  positive: "var(--color-success)",
  negative: "var(--color-error)",
  neutral: "var(--color-text-tertiary)",
  warning: "var(--color-warning)",
};

const toneBackground: Record<MetricTone, string> = {
  positive: "rgba(34, 197, 94, 0.12)",
  negative: "rgba(225, 29, 72, 0.12)",
  neutral: "var(--color-bg-surface)",
  warning: "rgba(245, 158, 11, 0.14)",
};

function Sparkline({ points, tone }: { points: number[]; tone: MetricTone }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(max - min, 1);
  const polyline = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 120;
      const y = 36 - ((point - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg aria-hidden="true" viewBox="0 0 120 40" style={{ width: "100%", height: 42, marginTop: "var(--space-3)" }}>
      <polyline
        fill="none"
        stroke={toneColor[tone]}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        points={polyline}
      />
    </svg>
  );
}

function KpiCard({ item }: { item: KpiCardData }) {
  const TrendIcon = item.trend === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className="analytics-card" style={{ borderRadius: "var(--radius-sm)", padding: "var(--space-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <div>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0,
              textTransform: "uppercase",
              marginBottom: "var(--space-4)",
            }}
          >
            {item.label}
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-3)" }}>
            <strong style={{ color: "var(--color-text-primary)", fontSize: 28, lineHeight: 1 }}>{item.value}</strong>
            <span
              style={{
                color: toneColor[item.tone],
                background: toneBackground[item.tone],
                borderRadius: "var(--radius-sm)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <TrendIcon size={14} />
              {item.change}
            </span>
          </div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-sm)",
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <item.icon size={20} />
        </div>
      </div>
      <Sparkline points={item.series} tone={item.tone} />
      <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{item.helper}</p>
    </Card>
  );
}

function Header({ view }: { view: DashboardView }) {
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle");
  const config = viewConfig[view];

  return (
    <div style={{ marginBottom: "var(--space-8)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-5)", alignItems: "flex-start" }}>
        <div>
          <div style={{ marginBottom: "var(--space-2)" }}>
            <span style={{ color: "var(--color-text-tertiary)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0 }}>
              {config.label}
            </span>
          </div>
          <h1>{config.title}</h1>
          <p style={{ maxWidth: 740, color: "var(--color-text-secondary)", marginTop: "var(--space-2)" }}>
            {config.description}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-2)" }}>
          <Button
            variant="secondary"
            onClick={() => setExportState(view === "executive" ? "success" : "error")}
            style={{ borderRadius: "var(--radius-sm)", padding: "10px 16px" }}
          >
            <Download size={16} />
            Xuất báo cáo
          </Button>
          {exportState !== "idle" ? (
            <span
              role="status"
              style={{
                color: exportState === "success" ? "var(--color-success)" : "var(--color-error)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {exportState === "success" ? "Đã tạo báo cáo mock" : "Xuất không thành công. Chọn range nhỏ hơn."}
            </span>
          ) : (
            <span style={{ color: "var(--color-text-tertiary)", fontSize: 12 }}>Last refreshed: 2 giờ trước</span>
          )}
        </div>
      </div>

      <div className="analytics-tabs" role="tablist" aria-label="Dashboard views">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            role="tab"
            aria-selected={view === tab.view}
            className="analytics-tab"
            style={{
              color: view === tab.view ? "var(--color-primary)" : "var(--color-text-secondary)",
              background: view === tab.view ? "var(--color-primary-light)" : "transparent",
              fontWeight: view === tab.view ? 700 : 500,
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function StateStrip() {
  return (
    <div className="analytics-state-grid" aria-label="Trạng thái preview">
      {dashboardStates.map((state) => {
        const Icon = state.tone === "negative" ? LockKeyhole : state.tone === "warning" ? RefreshCw : FileWarning;
        const tone = state.tone === "negative" ? "negative" : state.tone === "warning" ? "warning" : "neutral";

        return (
          <Card key={state.label} style={{ borderRadius: "var(--radius-sm)", padding: "var(--space-4)" }}>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
              <span
                style={{
                  color: toneColor[tone],
                  background: toneBackground[tone],
                  borderRadius: "var(--radius-sm)",
                  width: 34,
                  height: 34,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={17} />
              </span>
              <div>
                <strong style={{ display: "block", marginBottom: 4 }}>{state.label}</strong>
                <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{state.detail}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ExecutiveView() {
  return (
    <>
      <div className="analytics-kpi-grid">{executiveKpis.map((item) => <KpiCard key={item.id} item={item} />)}</div>
      <StateStrip />
      <div className="analytics-two-column">
        <ChartPanel title="Sell-through weekly" values={[42, 48, 51, 57, 62, 66, 68]} />
        <PromoSummary />
      </div>
    </>
  );
}

function PerformanceView() {
  return (
    <>
      <div className="analytics-kpi-grid analytics-kpi-grid--three">
        {performanceKpis.map((item) => <KpiCard key={item.id} item={item} />)}
      </div>
      <div className="analytics-two-column">
        <BranchTable />
        <PromoSummary expanded />
      </div>
    </>
  );
}

function FunnelView() {
  const max = Math.max(...funnelStages.map((stage) => stage.value));

  return (
    <div className="analytics-two-column">
      <Card style={{ borderRadius: "var(--radius-sm)" }}>
        <SectionTitle title="Conversion Funnel" note="Lead -> Contacted -> Proposal -> Converted" />
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          {funnelStages.map((stage) => (
            <div key={stage.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "var(--color-text-secondary)" }}>
                <span>{stage.label}</span>
                <strong style={{ color: "var(--color-text-primary)" }}>
                  {stage.value.toLocaleString("vi-VN")} · {stage.rate}
                </strong>
              </div>
              <div style={{ height: 16, borderRadius: "var(--radius-sm)", background: "var(--color-bg-surface)", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.max((stage.value / max) * 100, 8)}%`,
                    height: "100%",
                    background: "var(--color-primary)",
                    borderRadius: "var(--radius-sm)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ borderRadius: "var(--radius-sm)" }}>
        <SectionTitle title="Segment Performance" note="Không hiển thị 0 khi chưa đủ dữ liệu" />
        <MetricRow label="Khách trung thành" value="32.4% conversion" badge="Đủ dữ liệu" />
        <MetricRow label="Lead từ tư vấn AI" value="18.2% conversion" badge="Theo M10" />
        <MetricRow label="Nhóm mới dưới 30 records" value="-" badge="Chưa đủ dữ liệu" warning />
      </Card>
    </div>
  );
}

function AiRoiView() {
  return (
    <>
      <div className="analytics-kpi-grid">{aiRoiKpis.map((item) => <KpiCard key={item.id} item={item} />)}</div>
      <div className="analytics-two-column">
        <ChartPanel title="Answer success rate trend" values={[76, 79, 82, 84, 88, 91, 94]} />
        <Card style={{ borderRadius: "var(--radius-sm)" }}>
          <SectionTitle title="Phương pháp ước tính" note="Mock note cho Business Owner review" />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Giờ tiết kiệm = số query được AI trả lời thành công x thời gian xử lý thủ công trung bình. Công thức này chỉ
            dùng cho FE Preview, không phải báo cáo production.
          </p>
          <div style={{ marginTop: "var(--space-5)", display: "grid", gap: "var(--space-3)" }}>
            <MetricRow label="Query thành công" value="1,140" badge="M12" />
            <MetricRow label="Phút tiết kiệm mỗi query" value="2 phút" badge="Mock" />
            <MetricRow label="Tổng giờ ước tính" value="38h" badge="Preview" />
          </div>
        </Card>
      </div>
    </>
  );
}

function SectionTitle({ title, note }: { title: string; note: string }) {
  return (
    <div style={{ marginBottom: "var(--space-5)" }}>
      <h2>{title}</h2>
      <p style={{ color: "var(--color-text-secondary)", marginTop: 4 }}>{note}</p>
    </div>
  );
}

function MetricRow({ label, value, badge, warning }: { label: string; value: string; badge: string; warning?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "12px 0",
      }}
    >
      <div>
        <strong style={{ display: "block" }}>{label}</strong>
        <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{value}</span>
      </div>
      <Badge
        label={badge}
        color={warning ? "var(--color-warning)" : "var(--color-success)"}
        bg={warning ? "rgba(245, 158, 11, 0.14)" : "rgba(34, 197, 94, 0.12)"}
      />
    </div>
  );
}

function BranchTable() {
  return (
    <Card style={{ borderRadius: "var(--radius-sm)" }}>
      <SectionTitle title="Branch Performance" note="Regional scope được mô phỏng bằng mock data" />
      <div className="analytics-table" role="table" aria-label="Branch performance">
        <div className="analytics-table__row analytics-table__header" role="row">
          <span>Chi nhánh</span>
          <span>Doanh thu</span>
          <span>Đơn</span>
          <span>Sell-through</span>
        </div>
        {branchMetrics.map((branch) => (
          <div className="analytics-table__row" role="row" key={branch.branch}>
            <span>{branch.branch}</span>
            <span>{branch.revenue}</span>
            <span>{branch.scope === "denied" ? "-" : branch.orders}</span>
            <span>
              {branch.scope === "denied" ? (
                <Badge label="Bạn không có quyền xem khu vực này" color="var(--color-error)" bg="rgba(225, 29, 72, 0.12)" />
              ) : branch.sellThrough === null ? (
                <Badge label="Chưa đủ dữ liệu" color="var(--color-warning)" bg="rgba(245, 158, 11, 0.14)" />
              ) : (
                `${branch.sellThrough}% · ${branch.trend}`
              )}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PromoSummary({ expanded }: { expanded?: boolean }) {
  const [selected, setSelected] = useState<string[]>(["promo-0426", "promo-kid"]);
  const compared = promoMetrics.filter((promo) => selected.includes(promo.id));

  return (
    <Card style={{ borderRadius: "var(--radius-sm)" }}>
      <SectionTitle title="Promo Effectiveness" note="Chọn 2 CTKM để so sánh side-by-side" />
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {promoMetrics.map((promo) => {
          const disabled = promo.status === "insufficient";
          const checked = selected.includes(promo.id);

          return (
            <label
              key={promo.id}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "var(--space-3)",
                alignItems: "center",
                color: disabled ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() =>
                  setSelected((current) =>
                    current.includes(promo.id) ? current.filter((id) => id !== promo.id) : [...current.slice(-1), promo.id],
                  )
                }
              />
              <span>
                <strong>{promo.name}</strong>
                <small style={{ display: "block", color: "var(--color-text-secondary)" }}>
                  Apply count: {promo.applyCount} · Conversion: {promo.conversionRate}
                </small>
              </span>
              {disabled ? (
                <Badge label="Chưa đủ dữ liệu" color="var(--color-warning)" bg="rgba(245, 158, 11, 0.14)" />
              ) : (
                <CheckCircle2 size={17} color="var(--color-success)" />
              )}
            </label>
          );
        })}
      </div>
      {expanded ? (
        <div className="analytics-compare">
          {compared.map((promo) => (
            <div key={promo.id} style={{ background: "var(--color-bg-surface)", borderRadius: "var(--radius-sm)", padding: "var(--space-4)" }}>
              <strong>{promo.name}</strong>
              <MetricRow label="Conversion" value={promo.conversionRate} badge="Mock" />
              <MetricRow label="Discount depth" value={promo.discountDepth} badge="Mock" />
              <MetricRow label="Revenue attributed" value={promo.revenueAttributed} badge="Mock" />
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function ChartPanel({ title, values }: { title: string; values: number[] }) {
  const max = Math.max(...values);

  return (
    <Card style={{ borderRadius: "var(--radius-sm)" }}>
      <SectionTitle title={title} note="Chart mock dùng SVG local, không gọi API" />
      <div style={{ display: "flex", alignItems: "end", gap: "var(--space-3)", height: 210 }}>
        {values.map((value, index) => (
          <div
            // Stable mock series for visual review.
            key={`${title}-${index}-${value}`}
            style={{
              flex: 1,
              height: `${Math.max((value / max) * 100, 8)}%`,
              background: index === values.length - 1 ? "var(--color-primary)" : "var(--color-primary-muted)",
              borderRadius: "var(--radius-sm)",
              minWidth: 18,
            }}
            aria-label={`Điểm dữ liệu ${index + 1}: ${value}`}
          />
        ))}
      </div>
    </Card>
  );
}

export function BusinessAnalyticsPage({ view }: BusinessAnalyticsPageProps) {
  return (
    <div>
      <Header view={view} />
      {view === "executive" ? <ExecutiveView /> : null}
      {view === "performance" ? <PerformanceView /> : null}
      {view === "funnel" ? <FunnelView /> : null}
      {view === "ai-roi" ? <AiRoiView /> : null}
      <Card style={{ borderRadius: "var(--radius-sm)", marginTop: "var(--space-6)", background: "var(--color-primary-light)" }}>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
          <AlertTriangle size={18} style={{ color: "var(--color-primary)", marginTop: 2 }} />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Đây là FE Preview dùng mock/stub data cho review Dashboard M14. Không có BE, không gọi analytics API,
            không kết nối SAP B1, KiotViet, Haravan, M03-M06, M10, hoặc M12.
          </p>
        </div>
      </Card>
    </div>
  );
}
