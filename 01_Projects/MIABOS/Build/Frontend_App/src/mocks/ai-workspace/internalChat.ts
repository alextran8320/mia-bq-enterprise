export type AnswerType = "Policy" | "Data" | "Mixed" | "Blocked" | "Unsupported";
export type FreshnessState = "fresh" | "stale" | "conflict";

export interface SourceTraceItem {
  id: string;
  title: string;
  source: string;
  freshness: string;
  trust: "High" | "Medium" | "Low";
  excerpt: string;
}

export interface AnswerScenario {
  id: string;
  prompt: string;
  answerType: AnswerType;
  summary: string;
  freshnessState: FreshnessState;
  freshnessLabel: string;
  warning?: string;
  blockedReason?: string;
  /** Chỉ dùng cho Unsupported — câu hỏi clarifying từ AI */
  clarifyingQuestion?: string;
  dataPoints?: Array<{ label: string; value: string }>;
  citations?: Array<{ title: string; excerpt: string }>;
  sourceTrace: SourceTraceItem[];
  nextActions: string[];
}

// ---------------------------------------------------------------------------
// Scenario 1 — Policy (đổi trả)
// ---------------------------------------------------------------------------
const scenarioPolicyReturn: AnswerScenario = {
  id: "policy-return",
  prompt: "Chính sách đổi trả hiện tại thế nào?",
  answerType: "Policy",
  summary:
    "BQ cho phép đổi size trong 7 ngày nếu sản phẩm chưa qua sử dụng và còn đầy đủ phụ kiện đi kèm. Hoàn tiền không áp dụng cho hàng khuyến mãi.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 18 phút trước",
  citations: [
    {
      title: "Policy đổi trả nội bộ — v3.1",
      excerpt:
        "Cho phép đổi size trong 7 ngày kể từ ngày mua với điều kiện sản phẩm chưa qua sử dụng và còn nguyên hộp.",
    },
    {
      title: "FAQ — Trường hợp không áp dụng đổi trả",
      excerpt:
        "Hàng khuyến mãi, hàng thanh lý, và sản phẩm đã qua sử dụng không thuộc diện đổi hoặc hoàn tiền.",
    },
  ],
  sourceTrace: [
    {
      id: "src-001",
      title: "FAQ / Policy - Đổi trả v3.1",
      source: "M08 Knowledge Center",
      freshness: "Reviewed 2026-04-16 09:12",
      trust: "High",
      excerpt:
        "Policy hiện hành cho đổi size và quy định các trường hợp không áp dụng. Phê duyệt bởi Trưởng CSKH ngày 2026-04-01.",
    },
  ],
  nextActions: ["Xem nguồn", "Hỏi tiếp", "Tạo yêu cầu hỗ trợ"],
};

// ---------------------------------------------------------------------------
// Scenario 2 — Data (tồn kho, stale)
// ---------------------------------------------------------------------------
const scenarioDataInventory: AnswerScenario = {
  id: "data-inventory",
  prompt: "Mẫu BQ Runner còn hàng ở đâu?",
  answerType: "Data",
  summary:
    "BQ Runner (size 40–43) còn 12 đôi tại Cửa hàng Quận 1 và 5 đôi tại kho online. Dữ liệu đang đồng bộ chậm — nên xác nhận lại trước khi cam kết với khách.",
  freshnessState: "stale",
  freshnessLabel: "Dữ liệu có thể cũ",
  warning:
    "Tồn kho cửa hàng đang đồng bộ chậm 15 phút. Vui lòng xác nhận lại trực tiếp trước khi cam kết với khách hàng.",
  dataPoints: [
    { label: "Cửa hàng Quận 1", value: "12 đôi" },
    { label: "Kho online (Haravan)", value: "5 đôi" },
    { label: "Cập nhật cuối", value: "09:08 hôm nay" },
  ],
  sourceTrace: [
    {
      id: "src-002",
      title: "Inventory Snapshot - Quận 1",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-16 09:08",
      trust: "Medium",
      excerpt:
        "Tồn kho tại điểm bán Quận 1: 12 đôi (size 40–43). Sync lag ~15 phút.",
    },
    {
      id: "src-003",
      title: "Inventory Projection - Kho online",
      source: "Haravan",
      freshness: "Snapshot 2026-04-16 09:05",
      trust: "Medium",
      excerpt:
        "Kho online còn 5 đôi chưa giữ cho đơn pending. Số liệu chưa khấu trừ đơn đang xử lý.",
    },
  ],
  nextActions: ["Xem nguồn", "Kiểm tra SKU khác", "Tạo yêu cầu hỗ trợ"],
};

// ---------------------------------------------------------------------------
// Scenario 3 — Mixed (đơn hàng + chính sách giao hàng)
// ---------------------------------------------------------------------------
const scenarioMixedOrderPolicy: AnswerScenario = {
  id: "mixed-order-policy",
  prompt: "Đơn online #HD-2048 đang ở đâu và chính sách giao hàng áp dụng thế nào?",
  answerType: "Mixed",
  summary:
    "Đơn #HD-2048 đang chờ bàn giao cho đơn vị vận chuyển. Chính sách hiện hành cho phép giao tiêu chuẩn 2–4 ngày và miễn phí ship với đơn từ 699.000đ.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 4 phút trước",
  dataPoints: [
    { label: "Mã đơn", value: "#HD-2048" },
    { label: "Trạng thái", value: "Chờ bàn giao vận chuyển" },
    { label: "Kênh", value: "Haravan online" },
    { label: "Tổng giá trị", value: "850.000đ" },
  ],
  citations: [
    {
      title: "Policy giao hàng online — v2.4",
      excerpt:
        "Giao tiêu chuẩn 2–4 ngày làm việc. Miễn phí vận chuyển với đơn từ 699.000đ trong nội thành TP.HCM.",
    },
  ],
  sourceTrace: [
    {
      id: "src-004",
      title: "Order Snapshot - HD-2048",
      source: "Haravan",
      freshness: "Snapshot 2026-04-16 09:22",
      trust: "High",
      excerpt:
        "Đơn #HD-2048 chưa bàn giao cho đơn vị vận chuyển, đang chờ pick-up. Dự kiến lấy hàng trong ngày.",
    },
    {
      id: "src-005",
      title: "Policy giao hàng online — v2.4",
      source: "M08 Knowledge Center",
      freshness: "Reviewed 2026-04-15 17:45",
      trust: "High",
      excerpt:
        "Điều kiện miễn phí ship và SLA giao tiêu chuẩn cho kênh online nội thành.",
    },
  ],
  nextActions: ["Xem nguồn", "Tạo yêu cầu hỗ trợ", "Gửi phản hồi"],
};

// ---------------------------------------------------------------------------
// Scenario 4 — Blocked (pricing nội bộ, quyền hạn)
// ---------------------------------------------------------------------------
const scenarioBlockedPricing: AnswerScenario = {
  id: "blocked-pricing",
  prompt: "Cho tôi xem toàn bộ rule giá nội bộ theo từng nhóm chiết khấu.",
  answerType: "Blocked",
  summary: "Không thể hiển thị thông tin này.",
  freshnessState: "conflict",
  freshnessLabel: "Nguồn cần kiểm tra thêm",
  blockedReason:
    "Vai trò hiện tại chỉ được xem tóm tắt giá an toàn. Để xem toàn bộ ma trận chiết khấu nội bộ, cần được cấp quyền bởi Trưởng nhóm hoặc Ban điều hành.",
  warning:
    "Cần escalate sang Pricing Control hoặc Ban điều hành nếu thật sự cần truy cập chi tiết.",
  sourceTrace: [
    {
      id: "src-006",
      title: "Access Control Policy - Pricing",
      source: "M07 Access Control",
      freshness: "Reviewed 2026-04-16 08:40",
      trust: "High",
      excerpt:
        "Nhân sự CSKH và Sales chỉ được xem summary giá an toàn, không được xem full discount matrix nội bộ.",
    },
  ],
  nextActions: ["Tạo yêu cầu hỗ trợ", "Hỏi lại dạng tóm tắt", "Xem nguồn"],
};

// ---------------------------------------------------------------------------
// Scenario 5 — Policy (SOP vận hành cửa hàng)
// ---------------------------------------------------------------------------
const scenarioPolicySOP: AnswerScenario = {
  id: "policy-sop-store",
  prompt: "Quy trình mở cửa hàng buổi sáng là gì?",
  answerType: "Policy",
  summary:
    "Quy trình mở cửa hàng bao gồm 5 bước chuẩn: kiểm tra két tiền, bật hệ thống POS, kiểm tra tồn kho vật lý, cập nhật bảng giá, và xác nhận lịch làm việc nhân viên ca ngày.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 2 giờ trước",
  citations: [
    {
      title: "SOP vận hành cửa hàng — Mở ca sáng v1.8",
      excerpt:
        "Nhân viên trực ca phải hoàn thành checklist mở cửa trước 08:30. Bao gồm: két tiền, POS, tồn kho, bảng giá, lịch ca.",
    },
    {
      title: "Quy định bảo mật két tiền",
      excerpt:
        "Két tiền phải được kiểm tra bởi ít nhất 2 người và ký xác nhận trước khi bắt đầu ca.",
    },
  ],
  sourceTrace: [
    {
      id: "src-007",
      title: "SOP Mở ca sáng — v1.8",
      source: "M08 Knowledge Center",
      freshness: "Reviewed 2026-04-14 10:00",
      trust: "High",
      excerpt:
        "Checklist mở ca sáng chuẩn cho tất cả cửa hàng BQ. Phê duyệt bởi Ops Lead tháng 4/2026.",
    },
    {
      id: "src-008",
      title: "Quy định bảo mật két tiền",
      source: "M08 Knowledge Center",
      freshness: "Reviewed 2026-04-01 09:00",
      trust: "High",
      excerpt: "Bắt buộc xác nhận 2 người cho két tiền đầu ca.",
    },
  ],
  nextActions: ["Xem nguồn", "Tải checklist PDF", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Scenario 6 — Data (conflict — tồn kho mâu thuẫn giữa 2 nguồn)
// ---------------------------------------------------------------------------
const scenarioDataConflict: AnswerScenario = {
  id: "data-conflict-inventory",
  prompt: "Tồn kho BQ Classic màu đen size 42 tại kho trung tâm là bao nhiêu?",
  answerType: "Data",
  summary:
    "Phát hiện kết quả không đồng nhất giữa hai nguồn. KiotViet báo còn 8 đôi, SAP B1 báo còn 3 đôi. Khuyến nghị xác nhận trực tiếp tại kho trước khi xử lý đơn.",
  freshnessState: "conflict",
  freshnessLabel: "Nguồn mâu thuẫn",
  warning:
    "Các nguồn dữ liệu có kết quả khác nhau. Không nên cam kết số lượng với khách cho đến khi được kiểm tra trực tiếp.",
  dataPoints: [
    { label: "KiotViet (POS)", value: "8 đôi" },
    { label: "SAP B1 (kho)", value: "3 đôi" },
    { label: "Lần sync gần nhất", value: "08:15 hôm nay" },
  ],
  sourceTrace: [
    {
      id: "src-009",
      title: "Inventory - KiotViet Kho TT",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-16 08:15",
      trust: "Medium",
      excerpt:
        "Tồn kho BQ Classic đen size 42: 8 đôi. Số liệu chưa đồng bộ với SAP sau đợt kiểm kho tối qua.",
    },
    {
      id: "src-010",
      title: "Inventory - SAP B1 Warehouse",
      source: "SAP B1",
      freshness: "Snapshot 2026-04-16 07:50",
      trust: "High",
      excerpt:
        "Tồn kho sau kiểm kho 2026-04-15: 3 đôi. Đây là số liệu đã đối soát vật lý.",
    },
  ],
  nextActions: ["Xem nguồn", "Tạo yêu cầu hỗ trợ", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Scenario 7 — Mixed (CTKM + tồn kho cho tư vấn bán hàng)
// ---------------------------------------------------------------------------
const scenarioMixedPromoInventory: AnswerScenario = {
  id: "mixed-promo-inventory",
  prompt: "CTKM tháng 4 cho dòng giày thể thao là gì và còn hàng không?",
  answerType: "Mixed",
  summary:
    "Dòng giày thể thao đang có CTKM giảm 15% cho đơn từ 2 đôi trở lên, áp dụng đến 30/04. Tồn kho tốt: BQ Runner và BQ Sport đều trên 20 đôi tại các cửa hàng chính.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 6 phút trước",
  dataPoints: [
    { label: "BQ Runner (tổng kho)", value: "47 đôi" },
    { label: "BQ Sport (tổng kho)", value: "32 đôi" },
    { label: "Hiệu lực CTKM", value: "đến 30/04/2026" },
  ],
  citations: [
    {
      title: "CTKM tháng 4 — Giày thể thao",
      excerpt:
        "Giảm 15% khi mua từ 2 đôi cùng dòng thể thao. Không áp dụng cùng với voucher khác. Áp dụng cả kênh POS và online.",
    },
  ],
  sourceTrace: [
    {
      id: "src-011",
      title: "Promotion April 2026 - Sportwear",
      source: "M08 Knowledge Center",
      freshness: "Published 2026-04-01 08:00",
      trust: "High",
      excerpt:
        "CTKM được phê duyệt bởi Marketing Lead. Áp dụng toàn hệ thống từ 01/04 đến 30/04.",
    },
    {
      id: "src-012",
      title: "Inventory Summary - Sportwear Lines",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-16 09:18",
      trust: "Medium",
      excerpt:
        "Tổng tồn kho BQ Runner: 47 đôi (toàn hệ thống). BQ Sport: 32 đôi. Số liệu tổng hợp từ 5 cửa hàng.",
    },
  ],
  nextActions: ["Xem nguồn", "Kiểm tra SKU cụ thể", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Scenario 8 — Unsupported (intent ngoài phạm vi — low confidence)
// ---------------------------------------------------------------------------
const scenarioUnsupported: AnswerScenario = {
  id: "unsupported-out-of-scope",
  prompt: "Dự báo doanh thu tháng 5 của toàn hệ thống là bao nhiêu?",
  answerType: "Unsupported",
  summary: "Câu hỏi này nằm ngoài phạm vi hỗ trợ của Trợ lý AI Nội Bộ.",
  freshnessState: "fresh",
  freshnessLabel: "N/A",
  blockedReason:
    "Trợ lý AI Nội Bộ chỉ hỗ trợ tra cứu dữ liệu vận hành hiện tại và chính sách nội bộ. Dự báo doanh thu thuộc phạm vi phân tích của Ban điều hành và cần được xử lý bởi công cụ BI chuyên dụng.",
  clarifyingQuestion:
    "Bạn có muốn tra cứu doanh thu thực tế tháng trước, hoặc số liệu vận hành cụ thể như tồn kho, đơn hàng, tỉ lệ đổi trả thay thế không?",
  sourceTrace: [],
  nextActions: ["Hỏi câu khác", "Tạo yêu cầu hỗ trợ"],
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const INTERNAL_CHAT_SCENARIOS: AnswerScenario[] = [
  scenarioPolicyReturn,
  scenarioDataInventory,
  scenarioMixedOrderPolicy,
  scenarioBlockedPricing,
  scenarioPolicySOP,
  scenarioDataConflict,
  scenarioMixedPromoInventory,
  scenarioUnsupported,
];

export function inferScenarioFromPrompt(prompt: string): AnswerScenario {
  const p = prompt.toLowerCase();

  // Policy
  if (p.includes("đổi trả") || p.includes("hoàn tiền") || p.includes("đổi hàng")) {
    return scenarioPolicyReturn;
  }
  if (p.includes("sop") || p.includes("mở cửa") || p.includes("quy trình") || p.includes("checklist")) {
    return scenarioPolicySOP;
  }
  if (p.includes("policy") || p.includes("chính sách") || p.includes("quy định")) {
    return scenarioPolicyReturn;
  }

  // Data — conflict
  if (p.includes("mâu thuẫn") || p.includes("không đồng nhất") || p.includes("kho trung tâm")) {
    return scenarioDataConflict;
  }

  // Data — inventory
  if (
    p.includes("còn hàng") ||
    p.includes("tồn kho") ||
    p.includes("ở đâu") ||
    p.includes("còn bao nhiêu") ||
    p.includes("stock")
  ) {
    return scenarioDataInventory;
  }

  // Mixed — promo + inventory
  if (p.includes("ctkm") || p.includes("khuyến mãi") || p.includes("giảm giá")) {
    return scenarioMixedPromoInventory;
  }

  // Mixed — order + policy
  if (p.includes("đơn") || p.includes("giao hàng") || p.includes("vận chuyển") || p.includes("order")) {
    return scenarioMixedOrderPolicy;
  }

  // Blocked
  if (p.includes("chiết khấu") || p.includes("giá nội bộ") || p.includes("discount matrix")) {
    return scenarioBlockedPricing;
  }
  if (p.includes("giá") && (p.includes("nội bộ") || p.includes("toàn bộ") || p.includes("rule"))) {
    return scenarioBlockedPricing;
  }

  // Unsupported
  if (
    p.includes("dự báo") ||
    p.includes("forecast") ||
    p.includes("doanh thu tháng") ||
    p.includes("kế hoạch kinh doanh")
  ) {
    return scenarioUnsupported;
  }

  // Default fallback — policy return
  return scenarioPolicyReturn;
}
