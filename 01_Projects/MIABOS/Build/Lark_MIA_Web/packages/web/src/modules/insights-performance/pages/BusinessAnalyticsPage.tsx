import { Link } from "react-router-dom";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
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
    description: "Top KPI cho lãnh đạo BQ: doanh thu, đơn hàng, tỉ lệ AI trả lời thành công và tỉ lệ escalation.",
  },
  performance: {
    title: "Hiệu Quả Kinh Doanh",
    label: "Business Performance",
    description: "Sell-through, hiệu quả CTKM và so sánh chi nhánh/kênh bằng dữ liệu preview.",
  },
  funnel: {
    title: "Phễu Chuyển Đổi & CRM",
    label: "CRM & Funnel",
    description: "Funnel từ lead capture đến converted, kèm phân tích theo segment khách hàng và kênh tư vấn.",
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
  positive: "#16A34A",
  negative: "#DC2626",
  neutral: "#94A3B8",
  warning: "#D97706",
};

const toneBackground: Record<MetricTone, string> = {
  positive: "rgba(22, 163, 74, 0.10)",
  negative: "rgba(220, 38, 38, 0.10)",
  neutral: "#F1F5F9",
  warning: "rgba(217, 119, 6, 0.12)",
};

const toneChartColor: Record<MetricTone, string> = {
  positive: "#2563EB",
  negative: "#DC2626",
  neutral: "#94A3B8",
  warning: "#D97706",
};

// ── Shared ApexCharts base options ──────────────────────────────────────────
const chartFont = '"Be Vietnam Pro", "Inter", system-ui, sans-serif';

function sparklineOptions(tone: MetricTone): ApexOptions {
  const color = toneChartColor[tone];
  return {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      animations: { enabled: true, speed: 400 },
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.02,
        stops: [0, 100],
      },
    },
    colors: [color],
    tooltip: {
      enabled: false,
    },
  };
}

function columnChartOptions(labels: string[], color: string): ApexOptions {
  return {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: true, speed: 400 },
      fontFamily: chartFont,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "56%",
      },
    },
    dataLabels: { enabled: false },
    colors: [color],
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94A3B8", fontSize: "11px", fontFamily: chartFont },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#94A3B8", fontSize: "11px", fontFamily: chartFont },
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "light",
      style: { fontSize: "12px", fontFamily: chartFont },
    },
    states: {
      hover: { filter: { type: "darken" } },
    },
  };
}

// ── Components ───────────────────────────────────────────────────────────────

function Sparkline({ points, tone }: { points: number[]; tone: MetricTone }) {
  return (
    <div style={{ marginTop: "var(--space-3)" }}>
      <ReactApexChart
        type="area"
        height={44}
        series={[{ data: points }]}
        options={sparklineOptions(tone)}
      />
    </div>
  );
}

function KpiCard({ item }: { item: KpiCardData }) {
  const TrendIcon = item.trend === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card
      className="analytics-card"
      style={{
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-5)",
        transition: "box-shadow 0.18s, transform 0.18s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-ambient)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <div>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "var(--space-4)",
            }}
          >
            {item.label}
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-3)" }}>
            <strong style={{ color: "var(--color-text-primary)", fontSize: 28, lineHeight: 1 }}>
              {item.value}
            </strong>
            <span
              style={{
                color: toneColor[item.tone],
                background: toneBackground[item.tone],
                borderRadius: "var(--radius-xs)",
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                padding: "3px 7px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <TrendIcon size={13} />
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
      <p style={{ color: "var(--color-text-secondary)", fontSize: 13, marginTop: "var(--space-2)" }}>
        {item.helper}
      </p>
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
            <span style={{ color: "var(--color-text-tertiary)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
              {exportState === "success" ? "Đã tạo báo cáo" : "Xuất không thành công. Vui lòng chọn khoảng thời gian nhỏ hơn."}
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
              fontSize: 13,
              transition: "background 0.15s, color 0.15s",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              if (view !== tab.view) {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-bg-surface)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (view !== tab.view) {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-secondary)";
              }
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
    <div className="analytics-state-grid" aria-label="Trạng thái hệ thống">
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

const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function SellThroughChart({ values }: { values: number[] }) {
  const options: ApexOptions = {
    ...columnChartOptions(WEEK_LABELS, "#2563EB"),
    chart: {
      ...columnChartOptions(WEEK_LABELS, "#2563EB").chart,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: "52%",
        distributed: true,
      },
    },
    colors: values.map((_, i) =>
      i === values.length - 1 ? "#2563EB" : "#BFDBFE"
    ),
    legend: { show: false },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (v) => `${v}%`,
        style: { colors: "#94A3B8", fontSize: "11px", fontFamily: chartFont },
      },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (v) => `${v}%` },
      style: { fontSize: "12px", fontFamily: chartFont },
    },
  };

  return (
    <ReactApexChart
      type="bar"
      height={220}
      series={[{ name: "Sell-through", data: values }]}
      options={options}
    />
  );
}

function AiSuccessChart({ values }: { values: number[] }) {
  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      animations: { enabled: true, speed: 500 },
      fontFamily: chartFont,
    },
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.20,
        opacityTo: 0.02,
        stops: [0, 100],
      },
    },
    colors: ["#2563EB"],
    xaxis: {
      categories: WEEK_LABELS,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#94A3B8", fontSize: "11px", fontFamily: chartFont } },
    },
    yaxis: {
      min: 60,
      max: 100,
      tickAmount: 4,
      labels: {
        formatter: (v) => `${v}%`,
        style: { colors: "#94A3B8", fontSize: "11px", fontFamily: chartFont },
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    markers: { size: 4, colors: ["#ffffff"], strokeColors: "#2563EB", strokeWidth: 2 },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light",
      y: { formatter: (v) => `${v}%` },
      style: { fontSize: "12px", fontFamily: chartFont },
    },
  };

  return (
    <ReactApexChart
      type="area"
      height={220}
      series={[{ name: "Tỉ lệ thành công", data: values }]}
      options={options}
    />
  );
}

function FunnelChart() {
  const labels = funnelStages.map((s) => s.label);
  const values = funnelStages.map((s) => s.value);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: chartFont,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "55%",
        distributed: true,
      },
    },
    colors: ["#2563EB", "#3B82F6", "#60A5FA", "#BFDBFE"],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toLocaleString("vi-VN"),
      style: { fontSize: "12px", fontFamily: chartFont, fontWeight: "600" },
      dropShadow: { enabled: false },
    },
    legend: { show: false },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#94A3B8", fontSize: "11px", fontFamily: chartFont } },
    },
    yaxis: {
      labels: {
        style: { colors: "#0F172A", fontSize: "13px", fontFamily: chartFont, fontWeight: "500" },
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number, opts?: { dataPointIndex: number }) => {
          const rate = funnelStages[opts?.dataPointIndex ?? 0]?.rate ?? "";
          return `${val.toLocaleString("vi-VN")} (${rate})`;
        },
      },
      style: { fontSize: "12px", fontFamily: chartFont },
    },
  };

  return (
    <ReactApexChart
      type="bar"
      height={240}
      series={[{ name: "Khách hàng", data: values }]}
      options={options}
    />
  );
}

function ExecutiveView() {
  return (
    <>
      <div className="analytics-kpi-grid">
        {executiveKpis.map((item) => <KpiCard key={item.id} item={item} />)}
      </div>
      <StateStrip />
      <div className="analytics-two-column">
        <Card style={{ borderRadius: "var(--radius-sm)" }}>
          <SectionTitle title="Sell-through theo tuần" note="% hàng bán được trên tổng nhập kho" />
          <SellThroughChart values={[42, 48, 51, 57, 62, 66, 68]} />
        </Card>
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
  return (
    <div className="analytics-two-column">
      <Card style={{ borderRadius: "var(--radius-sm)" }}>
        <SectionTitle title="Conversion Funnel" note="Lead → Contacted → Proposal → Converted" />
        <FunnelChart />
      </Card>
      <Card style={{ borderRadius: "var(--radius-sm)" }}>
        <SectionTitle title="Segment Performance" note="Không hiển thị 0 khi chưa đủ dữ liệu" />
        <MetricRow label="Khách trung thành" value="32.4% conversion" badge="Đủ dữ liệu" />
        <MetricRow label="Lead từ tư vấn AI" value="18.2% conversion" badge="Đủ dữ liệu" />
        <MetricRow label="Nhóm mới dưới 30 records" value="-" badge="Chưa đủ dữ liệu" warning />
      </Card>
    </div>
  );
}

function AiRoiView() {
  return (
    <>
      <div className="analytics-kpi-grid">
        {aiRoiKpis.map((item) => <KpiCard key={item.id} item={item} />)}
      </div>
      <div className="analytics-two-column">
        <Card style={{ borderRadius: "var(--radius-sm)" }}>
          <SectionTitle title="AI answer success rate" note="7 ngày gần nhất" />
          <AiSuccessChart values={[76, 79, 82, 84, 88, 91, 94]} />
        </Card>
        <Card style={{ borderRadius: "var(--radius-sm)" }}>
          <SectionTitle title="Phương pháp ước tính" note="Giờ tiết kiệm = query thành công × thời gian xử lý thủ công" />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Thời gian xử lý thủ công trung bình được tính dựa trên khảo sát nội bộ với nhân viên CSKH và vận hành cửa hàng.
          </p>
          <div style={{ marginTop: "var(--space-5)", display: "grid", gap: "var(--space-3)" }}>
            <MetricRow label="Query thành công" value="1,140" badge="7 ngày" />
            <MetricRow label="Phút tiết kiệm mỗi query" value="2 phút" badge="Ước tính" />
            <MetricRow label="Tổng giờ ước tính" value="38h" badge="Tổng hợp" />
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
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div>
        <strong style={{ display: "block" }}>{label}</strong>
        <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{value}</span>
      </div>
      <Badge
        label={badge}
        color={warning ? "var(--color-warning)" : "var(--color-success)"}
        bg={warning ? "rgba(217, 119, 6, 0.12)" : "rgba(22, 163, 74, 0.10)"}
      />
    </div>
  );
}

function BranchTable() {
  return (
    <Card style={{ borderRadius: "var(--radius-sm)" }}>
      <SectionTitle title="Branch Performance" note="Theo phân quyền khu vực — chỉ hiển thị cửa hàng trong phạm vi" />
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
                <Badge label="Bạn không có quyền xem khu vực này" color="var(--color-error)" bg="rgba(220, 38, 38, 0.10)" />
              ) : branch.sellThrough === null ? (
                <Badge label="Chưa đủ dữ liệu" color="var(--color-warning)" bg="rgba(217, 119, 6, 0.12)" />
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
                cursor: disabled ? "not-allowed" : "pointer",
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
                <Badge label="Chưa đủ dữ liệu" color="var(--color-warning)" bg="rgba(217, 119, 6, 0.12)" />
              ) : (
                <CheckCircle2 size={17} color="var(--color-success)" />
              )}
            </label>
          );
        })}
      </div>
      {expanded && (
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
      )}
    </Card>
  );
}

export function BusinessAnalyticsPage({ view }: BusinessAnalyticsPageProps) {
  return (
    <div>
      <Header view={view} />
      {view === "executive" && <ExecutiveView />}
      {view === "performance" && <PerformanceView />}
      {view === "funnel" && <FunnelView />}
      {view === "ai-roi" && <AiRoiView />}
    </div>
  );
}
