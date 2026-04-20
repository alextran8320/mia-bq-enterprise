import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Clock3,
  MessageSquareWarning,
  PackageCheck,
  PhoneCall,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  UsersRound,
} from "lucide-react";

export type DashboardView = "executive" | "performance" | "funnel" | "ai-roi";
export type MetricTone = "positive" | "negative" | "neutral" | "warning";

export interface KpiCardData {
  id: string;
  label: string;
  value: string;
  helper: string;
  change: string;
  trend: "up" | "down" | "flat";
  tone: MetricTone;
  icon: LucideIcon;
  series: number[];
  targetRoute?: string;
}

export interface PromoMetric {
  id: string;
  name: string;
  applyCount: number;
  conversionRate: string;
  discountDepth: string;
  revenueAttributed: string;
  status: "healthy" | "warning" | "insufficient";
}

export interface FunnelStage {
  label: string;
  value: number;
  rate: string;
}

export interface BranchMetric {
  branch: string;
  revenue: string;
  orders: number;
  sellThrough: number | null;
  trend: string;
  scope: "allowed" | "denied";
}

export const executiveKpis: KpiCardData[] = [
  {
    id: "revenue",
    label: "Doanh Thu",
    value: "2.4 tỷ",
    helper: "So với kỳ trước",
    change: "+12.3%",
    trend: "up",
    tone: "positive",
    icon: ReceiptText,
    series: [42, 45, 46, 51, 53, 57, 64],
    targetRoute: "/analytics/performance",
  },
  {
    id: "orders",
    label: "Đơn Hàng",
    value: "1,240",
    helper: "So với kỳ trước",
    change: "+8.1%",
    trend: "up",
    tone: "positive",
    icon: PackageCheck,
    series: [30, 34, 33, 38, 42, 45, 49],
    targetRoute: "/analytics/performance",
  },
  {
    id: "ai-success",
    label: "Tỉ Lệ Trả Lời Thành Công",
    value: "94.2%",
    helper: "7 ngày gần nhất",
    change: "+4.8%",
    trend: "up",
    tone: "positive",
    icon: Activity,
    series: [74, 80, 83, 85, 89, 91, 94],
    targetRoute: "/analytics/ai-roi",
  },
  {
    id: "escalation",
    label: "Tỉ Lệ Escalation",
    value: "2.1%",
    helper: "Giảm là tín hiệu tốt",
    change: "-2.1%",
    trend: "down",
    tone: "positive",
    icon: MessageSquareWarning,
    series: [10, 8, 6, 5, 4, 3, 2],
    targetRoute: "/analytics/ai-roi",
  },
];

export const performanceKpis: KpiCardData[] = [
  {
    id: "sell-through",
    label: "Sell-through",
    value: "68%",
    helper: "Tuần này",
    change: "+6.4%",
    trend: "up",
    tone: "positive",
    icon: TrendingUp,
    series: [48, 50, 55, 58, 61, 64, 68],
  },
  {
    id: "promo-conversion",
    label: "Promo Conversion",
    value: "18.6%",
    helper: "Tuần này",
    change: "+3.2%",
    trend: "up",
    tone: "positive",
    icon: BarChart3,
    series: [9, 11, 12, 13, 16, 18, 19],
  },
  {
    id: "slow-stock",
    label: "Nhóm Chậm Bán",
    value: "14",
    helper: "SKU cần xử lý",
    change: "-5",
    trend: "down",
    tone: "positive",
    icon: TrendingDown,
    series: [25, 22, 21, 19, 18, 16, 14],
  },
];

export const branchMetrics: BranchMetric[] = [
  { branch: "Đà Nẵng - Hải Châu", revenue: "410tr", orders: 218, sellThrough: 82, trend: "+14%", scope: "allowed" },
  { branch: "Hà Nội - Cầu Giấy", revenue: "355tr", orders: 190, sellThrough: 71, trend: "+8%", scope: "allowed" },
  { branch: "TP.HCM - Quận 3", revenue: "392tr", orders: 204, sellThrough: 64, trend: "+5%", scope: "allowed" },
  { branch: "Khu vực miền Tây", revenue: "Không có quyền", orders: 0, sellThrough: null, trend: "-", scope: "denied" },
];

export const promoMetrics: PromoMetric[] = [
  {
    id: "promo-0426",
    name: "Back To Work 04/26",
    applyCount: 182,
    conversionRate: "21.4%",
    discountDepth: "12%",
    revenueAttributed: "612tr",
    status: "healthy",
  },
  {
    id: "promo-kid",
    name: "Giày Trẻ Em Cuối Tuần",
    applyCount: 96,
    conversionRate: "17.8%",
    discountDepth: "9%",
    revenueAttributed: "214tr",
    status: "warning",
  },
  {
    id: "promo-new",
    name: "BST Hè Mới",
    applyCount: 34,
    conversionRate: "-",
    discountDepth: "8%",
    revenueAttributed: "Chưa đủ dữ liệu",
    status: "insufficient",
  },
];

export const funnelStages: FunnelStage[] = [
  { label: "Lead Captured", value: 1240, rate: "100%" },
  { label: "Contacted", value: 890, rate: "71.8%" },
  { label: "Proposal Sent", value: 512, rate: "57.5%" },
  { label: "Converted", value: 186, rate: "36.3%" },
];

export const aiRoiKpis: KpiCardData[] = [
  {
    id: "answer-success",
    label: "AI trả lời thành công",
    value: "94.2%",
    helper: "7 ngày gần nhất",
    change: "+4.8%",
    trend: "up",
    tone: "positive",
    icon: Activity,
    series: [76, 79, 82, 84, 88, 91, 94],
  },
  {
    id: "lead-capture",
    label: "Lead từ AI",
    value: "126",
    helper: "Tháng này",
    change: "+22",
    trend: "up",
    tone: "positive",
    icon: UsersRound,
    series: [30, 42, 48, 56, 78, 102, 126],
  },
  {
    id: "time-saved",
    label: "Giờ tiết kiệm",
    value: "38h",
    helper: "Ước tính từ query thành công",
    change: "+9h",
    trend: "up",
    tone: "positive",
    icon: Clock3,
    series: [8, 14, 18, 21, 28, 32, 38],
  },
  {
    id: "handoff",
    label: "Yêu cầu chuyển người thật",
    value: "42",
    helper: "Cần xem chất lượng câu trả lời",
    change: "-11",
    trend: "down",
    tone: "positive",
    icon: PhoneCall,
    series: [75, 68, 63, 55, 50, 45, 42],
  },
];

export const dashboardStates = [
  {
    label: "Đang cập nhật dữ liệu",
    detail: "Hệ thống đang tổng hợp số liệu mới nhất. Vui lòng quay lại sau ít phút.",
    tone: "warning" as const,
  },
  {
    label: "Dữ liệu chưa đủ",
    detail: "Một số CTKM có dưới 50 lượt áp dụng nên chưa hiển thị được conversion rate.",
    tone: "neutral" as const,
  },
  {
    label: "Phân quyền khu vực",
    detail: "Một số khu vực không nằm trong phạm vi được phân công, dữ liệu bị ẩn theo cấu hình vai trò.",
    tone: "negative" as const,
  },
];
