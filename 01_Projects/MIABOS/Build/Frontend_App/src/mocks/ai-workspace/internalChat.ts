export type AnswerType =
  | "Policy"
  | "Data"
  | "Mixed"
  | "Blocked"
  | "Unsupported";
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
// Scenario 1 — Data (tồn kho SKU BQ-2301 tại kho Hà Nội)
// ---------------------------------------------------------------------------
const scenarioInventoryBQ2301: AnswerScenario = {
  id: "data-inventory-bq2301",
  prompt: "Mã BQ-2301 size 40 màu đen còn bao nhiêu tại kho Hà Nội?",
  answerType: "Data",
  summary:
    "Theo dữ liệu từ KiotViet (cập nhật 09:15 hôm nay): Mã BQ-2301 size 40 màu đen tại kho Hà Nội còn **10 đôi** (tồn thực: 12, đã giữ: 2). Dữ liệu đang đồng bộ chậm — nên xác nhận lại trước khi cam kết với khách.",
  freshnessState: "stale",
  freshnessLabel: "Dữ liệu có thể cũ — sync lag ~15 phút",
  warning:
    "Tồn kho cửa hàng Hà Nội đang đồng bộ chậm 15 phút. Vui lòng xác nhận lại trực tiếp trước khi cam kết số lượng với khách.",
  dataPoints: [
    { label: "Mã sản phẩm", value: "BQ-2301 — Giày da nam BQ Classic" },
    { label: "Size / Màu", value: "40 / Đen" },
    { label: "Tồn thực tế", value: "12 đôi" },
    { label: "Đã giữ (đơn pending)", value: "2 đôi" },
    { label: "Tồn khả dụng", value: "10 đôi" },
    { label: "Kho", value: "Kho Hà Nội — Hoàn Kiếm" },
    { label: "Cập nhật lúc", value: "09:15 hôm nay" },
  ],
  sourceTrace: [
    {
      id: "src-001",
      title: "Inventory Snapshot — BQ-2301 Kho HN",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-20 09:15",
      trust: "Medium",
      excerpt:
        "Tồn kho BQ-2301 size 40 màu đen tại kho Hoàn Kiếm: 12 đôi (thực tế), 2 đôi đang giữ cho đơn pending. Sync lag ~15 phút so với SAP B1.",
    },
    {
      id: "src-002",
      title: "Inventory Projection — SAP B1 Warehouse",
      source: "SAP B1",
      freshness: "Snapshot 2026-04-20 09:00",
      trust: "High",
      excerpt:
        "Tồn kho sau kiểm kho 2026-04-19: 10 đôi khả dụng (đã trừ hàng đang giữ). Số liệu đã đối soát vật lý.",
    },
  ],
  nextActions: [
    "Xem nguồn",
    "Kiểm tra size khác",
    "Kiểm tra kho TP.HCM",
    "Tạo yêu cầu hỗ trợ",
  ],
};

// ---------------------------------------------------------------------------
// Scenario 2 — Mixed (CTKM cửa hàng chính hãng tháng này)
// ---------------------------------------------------------------------------
const scenarioCTKMCuaHang: AnswerScenario = {
  id: "mixed-ctkm-cuahang",
  prompt: "CTKM tháng này áp dụng cho cửa hàng chính hãng gồm những gì?",
  answerType: "Mixed",
  summary:
    "Tháng 4/2026 có 2 chương trình áp dụng tại cửa hàng chính hãng: (1) Giảm 20% toàn bộ sản phẩm — hiệu lực đến 30/04; (2) Tặng vớ BQ miễn phí khi mua từ 2 đôi trở lên. Cả hai CTKM có thể dùng đồng thời.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 12 phút trước",
  dataPoints: [
    { label: "CTKM-2026-001", value: "Giảm 20% — đến 30/04/2026" },
    { label: "CTKM-2026-005", value: "Tặng vớ BQ khi mua ≥ 2 đôi" },
    { label: "Áp dụng tại", value: "Tất cả cửa hàng chính hãng" },
    { label: "Kết hợp được không?", value: "Có — không xung đột" },
  ],
  citations: [
    {
      title: "CTKM tháng 4 — Cửa hàng chính hãng v1.0",
      excerpt:
        "Giảm 20% áp dụng toàn bộ danh mục, ngoại trừ hàng đang thanh lý. Không áp dụng cùng voucher cá nhân.",
    },
    {
      title: "Chương trình quà tặng T4/2026",
      excerpt:
        "Tặng 1 đôi vớ BQ (trị giá 49.000đ) khi mua từ 2 đôi giày bất kỳ tại cửa hàng chính hãng trong tháng 4.",
    },
  ],
  sourceTrace: [
    {
      id: "src-003",
      title: "CTKM Tháng 4 — Cửa hàng chính hãng",
      source: "M08 Knowledge Center",
      freshness: "Published 2026-04-01 08:00",
      trust: "High",
      excerpt:
        "Chương trình được phê duyệt bởi Marketing Lead ngày 28/03/2026. Áp dụng toàn bộ cửa hàng chính hãng từ 01/04 đến 30/04/2026.",
    },
    {
      id: "src-004",
      title: "Chương trình quà tặng T4/2026",
      source: "M08 Knowledge Center",
      freshness: "Published 2026-04-01 08:00",
      trust: "High",
      excerpt:
        "Phê duyệt bởi Trưởng nhóm kinh doanh. Áp dụng tại tất cả cửa hàng chính hãng, không áp dụng kênh online.",
    },
  ],
  nextActions: [
    "Xem nguồn",
    "Kiểm tra CTKM online",
    "Hỏi tiếp",
    "Tạo yêu cầu hỗ trợ",
  ],
};

// ---------------------------------------------------------------------------
// Scenario 3 — Data (giá bán lẻ BQ-1102)
// ---------------------------------------------------------------------------
const scenarioPriceBQ1102: AnswerScenario = {
  id: "data-price-bq1102",
  prompt: "Giá bán lẻ hiện tại của mã BQ-1102 là bao nhiêu?",
  answerType: "Data",
  summary:
    "Theo dữ liệu từ KiotViet (cập nhật 08:45 hôm nay): Mã BQ-1102 (Dép thể thao nữ BQ Breeze) đang có giá bán lẻ **549.000đ** — đang áp dụng CTKM giảm 15%, giá cuối **466.650đ**.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 35 phút trước",
  dataPoints: [
    { label: "Mã sản phẩm", value: "BQ-1102 — Dép thể thao nữ BQ Breeze" },
    { label: "Giá gốc (niêm yết)", value: "549.000đ" },
    { label: "CTKM đang áp dụng", value: "Giảm 15% — CTKM-2026-001" },
    { label: "Giá cuối (sau giảm)", value: "466.650đ" },
    {
      label: "Bảng giá áp dụng",
      value: "BG-2026-001 — Bán lẻ tiêu chuẩn 2026",
    },
    { label: "Nguồn giá", value: "KiotViet — đồng bộ 08:45" },
  ],
  sourceTrace: [
    {
      id: "src-005",
      title: "Price Snapshot — BQ-1102",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-20 08:45",
      trust: "High",
      excerpt:
        "Giá bán lẻ BQ-1102: 549.000đ. Đang áp CTKM-2026-001 (giảm 15%), giá cuối: 466.650đ. Bảng giá BG-2026-001.",
    },
    {
      id: "src-006",
      title: "Bảng giá bán lẻ tiêu chuẩn 2026",
      source: "SAP B1",
      freshness: "Updated 2026-01-01",
      trust: "High",
      excerpt:
        "BQ-1102 — Dép thể thao nữ BQ Breeze: giá niêm yết 549.000đ. Áp dụng từ 01/01/2026, không thời hạn.",
    },
  ],
  nextActions: [
    "Xem nguồn",
    "Kiểm tra giá đại lý",
    "Kiểm tra tồn kho BQ-1102",
    "Hỏi tiếp",
  ],
};

// ---------------------------------------------------------------------------
// Scenario 4 — Data (trạng thái đơn hàng #98765)
// ---------------------------------------------------------------------------
const scenarioOrderStatus: AnswerScenario = {
  id: "data-order-98765",
  prompt: "Đơn hàng #98765 đang ở trạng thái nào?",
  answerType: "Data",
  summary:
    "Theo dữ liệu từ Haravan (cập nhật 09:30 hôm nay): Đơn #98765 đang ở trạng thái **Đang giao** — đã bàn giao cho Giao Hàng Nhanh lúc 07:45 sáng nay, dự kiến giao trước 17:00 hôm nay.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 10 phút trước",
  dataPoints: [
    { label: "Mã đơn", value: "#98765" },
    { label: "Khách hàng", value: "Nguyễn Thị Lan — 0912 345 678" },
    { label: "Trạng thái", value: "Đang giao" },
    { label: "Đơn vị vận chuyển", value: "Giao Hàng Nhanh (GHN)" },
    { label: "Mã vận đơn", value: "GHN-2026-088321" },
    { label: "Bàn giao lúc", value: "07:45 hôm nay" },
    { label: "Dự kiến giao", value: "Trước 17:00 hôm nay" },
    { label: "Giá trị đơn", value: "933.300đ" },
  ],
  sourceTrace: [
    {
      id: "src-007",
      title: "Order Snapshot — #98765",
      source: "Haravan",
      freshness: "Snapshot 2026-04-20 09:30",
      trust: "High",
      excerpt:
        "Đơn #98765 đã bàn giao GHN lúc 07:45, mã vận đơn GHN-2026-088321. Trạng thái: Đang giao. ETA: trước 17:00.",
    },
    {
      id: "src-008",
      title: "Tracking — GHN-2026-088321",
      source: "Giao Hàng Nhanh API",
      freshness: "Snapshot 2026-04-20 09:28",
      trust: "High",
      excerpt:
        "Đơn đang trên xe giao. Tài xế: Trần Văn Hùng — 0909 111 222. Dự kiến giao trước 17:00 ngày 20/04/2026.",
    },
  ],
  nextActions: [
    "Xem nguồn",
    "Kiểm tra đơn khác",
    "Tạo yêu cầu hỗ trợ",
    "Gửi phản hồi",
  ],
};

// ---------------------------------------------------------------------------
// Scenario 5 — Policy (đổi trả)
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
      id: "src-009",
      title: "FAQ / Policy — Đổi trả v3.1",
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
// Scenario 6 — Data (tồn kho BQ Runner — stale)
// ---------------------------------------------------------------------------
const scenarioDataInventory: AnswerScenario = {
  id: "data-inventory-runner",
  prompt: "Giày thể thao BQ Runner (BQ-2301) còn hàng ở đâu?",
  answerType: "Data",
  summary:
    "Theo dữ liệu từ KiotViet (cập nhật 09:08 hôm nay): Giày thể thao BQ Runner (BQ-2301) size 40–43 còn 12 đôi tại Cửa hàng Quận 1 và 5 đôi tại kho online. Dữ liệu đang đồng bộ chậm — nên xác nhận lại trước khi cam kết với khách.",
  freshnessState: "stale",
  freshnessLabel: "Dữ liệu có thể cũ",
  warning:
    "Tồn kho cửa hàng đang đồng bộ chậm 15 phút. Vui lòng xác nhận lại trực tiếp trước khi cam kết với khách hàng.",
  dataPoints: [
    { label: "Cửa hàng Quận 1", value: "12 đôi (size 40–43)" },
    { label: "Kho online (Haravan)", value: "5 đôi" },
    { label: "Cập nhật cuối", value: "09:08 hôm nay" },
  ],
  sourceTrace: [
    {
      id: "src-010",
      title: "Inventory Snapshot — BQ-2301 Quận 1",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-20 09:08",
      trust: "Medium",
      excerpt:
        "Tồn kho BQ Runner tại điểm bán Quận 1: 12 đôi (size 40–43). Sync lag ~15 phút.",
    },
    {
      id: "src-011",
      title: "Inventory Projection — Kho online",
      source: "Haravan",
      freshness: "Snapshot 2026-04-20 09:05",
      trust: "Medium",
      excerpt:
        "Kho online còn 5 đôi chưa giữ cho đơn pending. Số liệu chưa khấu trừ đơn đang xử lý.",
    },
  ],
  nextActions: ["Xem nguồn", "Kiểm tra SKU khác", "Tạo yêu cầu hỗ trợ"],
};

// ---------------------------------------------------------------------------
// Scenario 7 — Mixed (đơn hàng + chính sách giao hàng)
// ---------------------------------------------------------------------------
const scenarioMixedOrderPolicy: AnswerScenario = {
  id: "mixed-order-policy",
  prompt:
    "Đơn online #HD-2048 đang ở đâu và chính sách giao hàng áp dụng thế nào?",
  answerType: "Mixed",
  summary:
    "Theo dữ liệu từ Haravan (cập nhật 09:22 hôm nay): Đơn #HD-2048 đang chờ bàn giao cho đơn vị vận chuyển. Chính sách hiện hành cho phép giao tiêu chuẩn 2–4 ngày và miễn phí ship với đơn từ 699.000đ.",
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
      id: "src-012",
      title: "Order Snapshot — HD-2048",
      source: "Haravan",
      freshness: "Snapshot 2026-04-20 09:22",
      trust: "High",
      excerpt:
        "Đơn #HD-2048 chưa bàn giao cho đơn vị vận chuyển, đang chờ pick-up. Dự kiến lấy hàng trong ngày.",
    },
    {
      id: "src-013",
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
// Scenario 8 — Blocked (pricing nội bộ)
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
      id: "src-014",
      title: "Access Control Policy — Pricing",
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
// Scenario 9 — Policy (SOP vận hành cửa hàng)
// ---------------------------------------------------------------------------
const scenarioPolicySOP: AnswerScenario = {
  id: "policy-sop-store",
  prompt: "Quy trình mở cửa hàng buổi sáng là gì?",
  answerType: "Policy",
  summary:
    "Quy trình mở cửa hàng BQ bao gồm 5 bước chuẩn: kiểm tra két tiền, bật hệ thống POS, kiểm tra tồn kho vật lý, cập nhật bảng giá, và xác nhận lịch làm việc nhân viên ca ngày.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 2 giờ trước",
  citations: [
    {
      title: "SOP vận hành cửa hàng BQ — Mở ca sáng v1.8",
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
      id: "src-015",
      title: "SOP Mở ca sáng BQ — v1.8",
      source: "M08 Knowledge Center",
      freshness: "Reviewed 2026-04-14 10:00",
      trust: "High",
      excerpt:
        "Checklist mở ca sáng chuẩn cho tất cả cửa hàng BQ. Phê duyệt bởi Ops Lead tháng 4/2026.",
    },
    {
      id: "src-016",
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
// Scenario 10 — Data (conflict — tồn kho mâu thuẫn giữa 2 nguồn)
// ---------------------------------------------------------------------------
const scenarioDataConflict: AnswerScenario = {
  id: "data-conflict-inventory",
  prompt:
    "Tồn kho Giày da nam BQ Classic (BQ-1842) màu đen size 42 tại kho trung tâm là bao nhiêu?",
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
      id: "src-017",
      title: "Inventory — KiotViet Kho TT",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-20 08:15",
      trust: "Medium",
      excerpt:
        "Tồn kho BQ-1842 đen size 42: 8 đôi. Số liệu chưa đồng bộ với SAP sau đợt kiểm kho tối qua.",
    },
    {
      id: "src-018",
      title: "Inventory — SAP B1 Warehouse",
      source: "SAP B1",
      freshness: "Snapshot 2026-04-20 07:50",
      trust: "High",
      excerpt:
        "Tồn kho sau kiểm kho 2026-04-19: 3 đôi. Đây là số liệu đã đối soát vật lý.",
    },
  ],
  nextActions: ["Xem nguồn", "Tạo yêu cầu hỗ trợ", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Scenario 11 — Mixed (CTKM + tồn kho giày thể thao)
// ---------------------------------------------------------------------------
const scenarioMixedPromoInventory: AnswerScenario = {
  id: "mixed-promo-inventory",
  prompt: "CTKM tháng 4 cho dòng giày thể thao là gì và còn hàng không?",
  answerType: "Mixed",
  summary:
    "Dòng giày thể thao đang có CTKM giảm 15% cho đơn từ 2 đôi trở lên, áp dụng đến 30/04. Tồn kho tốt: BQ Runner (BQ-2301) và BQ Sport (BQ-2405) đều trên 20 đôi tại các cửa hàng chính.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 6 phút trước",
  dataPoints: [
    { label: "BQ Runner BQ-2301 (tổng kho)", value: "47 đôi" },
    { label: "BQ Sport BQ-2405 (tổng kho)", value: "32 đôi" },
    { label: "Hiệu lực CTKM", value: "đến 30/04/2026" },
  ],
  citations: [
    {
      title: "CTKM tháng 4 — Giày thể thao BQ",
      excerpt:
        "Giảm 15% khi mua từ 2 đôi cùng dòng thể thao. Không áp dụng cùng với voucher khác. Áp dụng cả kênh POS và online.",
    },
  ],
  sourceTrace: [
    {
      id: "src-019",
      title: "Promotion April 2026 — Sportwear BQ",
      source: "M08 Knowledge Center",
      freshness: "Published 2026-04-01 08:00",
      trust: "High",
      excerpt:
        "CTKM được phê duyệt bởi Marketing Lead. Áp dụng toàn hệ thống từ 01/04 đến 30/04.",
    },
    {
      id: "src-020",
      title: "Inventory Summary — Sportwear Lines BQ",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-20 09:18",
      trust: "Medium",
      excerpt:
        "Tổng tồn kho BQ Runner (BQ-2301): 47 đôi (toàn hệ thống). BQ Sport (BQ-2405): 32 đôi. Số liệu tổng hợp từ 5 cửa hàng.",
    },
  ],
  nextActions: ["Xem nguồn", "Kiểm tra SKU cụ thể", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Scenario 12 — Unsupported
// ---------------------------------------------------------------------------
const scenarioUnsupported: AnswerScenario = {
  id: "unsupported-out-of-scope",
  prompt: "Dự báo doanh thu tháng 5 của toàn hệ thống BQ là bao nhiêu?",
  answerType: "Unsupported",
  summary: "Câu hỏi này nằm ngoài phạm vi hỗ trợ của Trợ lý AI Nội Bộ BQ.",
  freshnessState: "fresh",
  freshnessLabel: "N/A",
  blockedReason:
    "Trợ lý AI Nội Bộ chỉ hỗ trợ tra cứu dữ liệu vận hành hiện tại và chính sách nội bộ BQ. Dự báo doanh thu thuộc phạm vi phân tích của Ban điều hành và cần được xử lý bởi công cụ BI chuyên dụng.",
  clarifyingQuestion:
    "Bạn có muốn tra cứu doanh thu thực tế tháng trước, hoặc số liệu vận hành cụ thể như tồn kho, đơn hàng, tỉ lệ đổi trả thay thế không?",
  sourceTrace: [],
  nextActions: ["Hỏi câu khác", "Tạo yêu cầu hỗ trợ"],
};

// ---------------------------------------------------------------------------
// Scenario 9 — Data (tồn kho theo mã SKU + chi nhánh cụ thể)
// ---------------------------------------------------------------------------
const scenarioInventoryBySKU: AnswerScenario = {
  id: "data-inventory-sku",
  prompt: "Mã BQ-2301 size 40 màu đen còn bao nhiêu tại kho Hà Nội?",
  answerType: "Data",
  summary:
    "Mã BQ-2301 size 40 màu đen tại kho Hà Nội (Cầu Giấy) hiện còn 10 đôi tồn thực, trong đó 2 đôi đã được giữ cho đơn đang xử lý — tồn khả dụng thực tế là 8 đôi. Dữ liệu được cập nhật lúc 09:15 hôm nay.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 09:15 hôm nay",
  dataPoints: [
    { label: "Kho Hà Nội — Cầu Giấy", value: "10 đôi (tồn thực)" },
    { label: "Đã giữ cho đơn đang xử lý", value: "2 đôi" },
    { label: "Khả dụng thực tế", value: "8 đôi" },
    { label: "Kho Hà Nội — Hoàng Mai", value: "4 đôi" },
    { label: "Cập nhật cuối", value: "09:15 hôm nay" },
  ],
  sourceTrace: [
    {
      id: "src-101",
      title: "Inventory — KiotViet Kho Hà Nội (Cầu Giấy)",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-19 09:15",
      trust: "High",
      excerpt:
        "Mã BQ-2301 / Size 40 / Màu đen: tồn thực 10 đôi. Đã reserved 2 đôi cho đơn #HD-3201 và #HD-3208 đang chờ xuất kho.",
    },
    {
      id: "src-102",
      title: "Inventory — KiotViet Kho Hà Nội (Hoàng Mai)",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-19 09:10",
      trust: "High",
      excerpt:
        "Mã BQ-2301 / Size 40 / Màu đen: tồn 4 đôi, không có đơn reserved. Kho phụ, phục vụ khu vực miền Nam Hà Nội.",
    },
    {
      id: "src-103",
      title: "Item Master — SAP B1",
      source: "SAP B1",
      freshness: "Snapshot 2026-04-19 08:50",
      trust: "High",
      excerpt:
        "BQ-2301: Giày da nam, đế cao su, màu đen. Mức tồn kho tối thiểu toàn hệ thống: 20 đôi/size. Hiện đang dưới ngưỡng — cần cân nhắc đặt thêm.",
    },
  ],
  nextActions: ["Xem nguồn", "Kiểm tra SKU khác", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Scenario 10 — Mixed (giá bán + chính sách giá bán lẻ)
// ---------------------------------------------------------------------------
const scenarioPricingRetail: AnswerScenario = {
  id: "mixed-pricing-retail",
  prompt: "Giá bán lẻ hiện tại của mã BQ-1102 là bao nhiêu?",
  answerType: "Mixed",
  summary:
    "Giá bán lẻ niêm yết của BQ-1102 (Dép thể thao nữ) hiện là 450.000đ. Sản phẩm không thuộc diện khuyến mãi tháng này. Mức giá này áp dụng đồng nhất cho cả kênh cửa hàng và online theo chính sách 1 giá của BQ.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật từ SAP B1 sáng nay",
  dataPoints: [
    { label: "Mã sản phẩm", value: "BQ-1102" },
    { label: "Tên sản phẩm", value: "Dép thể thao nữ BQ-1102" },
    { label: "Giá niêm yết", value: "450.000đ" },
    { label: "Đang có CTKM", value: "Không" },
    { label: "Áp dụng tại", value: "Tất cả kênh (POS + Online)" },
  ],
  citations: [
    {
      title: "Chính sách 1 giá — Giày BQ",
      excerpt:
        "BQ áp dụng chính sách đồng giá toàn kênh. Giá niêm yết trên sản phẩm là giá bán chính thức. Nhân viên không được tự ý điều chỉnh giá ngoài CTKM chính thức.",
    },
    {
      title: "FAQ: Chính sách giá và chiết khấu khách lẻ",
      excerpt:
        "Khách lẻ không được chiết khấu thêm ngoài CTKM. Đề nghị giảm giá ngoài chương trình chính thức cần từ chối lịch sự và hướng khách đăng ký thành viên.",
    },
  ],
  sourceTrace: [
    {
      id: "src-201",
      title: "Item Master — BQ-1102 (SAP B1)",
      source: "SAP B1",
      freshness: "Snapshot 2026-04-19 08:00",
      trust: "High",
      excerpt:
        "BQ-1102 / Dép thể thao nữ: Giá bán lẻ: 450.000đ. Giá vốn: bảo mật — chỉ Finance được xem. Không có đợt điều chỉnh giá trong 30 ngày gần đây.",
    },
    {
      id: "src-202",
      title: "Promotion Registry — Tháng 4/2026",
      source: "KiotViet",
      freshness: "Snapshot 2026-04-19 08:30",
      trust: "High",
      excerpt:
        "BQ-1102 không nằm trong danh mục CTKM tháng 4. CTKM tháng 4 chỉ áp dụng cho dòng giày da nam và giày thể thao theo CTKM-2026-001.",
    },
    {
      id: "src-203",
      title: "Chính sách giá bán lẻ — Knowledge Center",
      source: "M08 Knowledge Center",
      freshness: "Reviewed 2026-04-15 09:00",
      trust: "High",
      excerpt:
        "Chính sách 1 giá toàn kênh: giá cửa hàng = giá online. Phê duyệt bởi Giám đốc Kinh doanh. Hiệu lực từ 01/01/2026.",
    },
  ],
  nextActions: ["Xem nguồn", "Kiểm tra SKU khác", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Scenario 12 — Policy (chính sách bảo hành sản phẩm da cao cấp)
// ---------------------------------------------------------------------------
const scenarioPolicyWarranty: AnswerScenario = {
  id: "policy-warranty-leather",
  prompt: "Chính sách bảo hành giày da cao cấp là bao nhiêu tháng?",
  answerType: "Policy",
  summary:
    "Giày da cao cấp của BQ được bảo hành 12 tháng cho lỗi đế do sản xuất và 6 tháng cho lỗi da do sản xuất. Khách hàng cần xuất trình hóa đơn mua hàng khi yêu cầu bảo hành. Lưu ý: chính sách v2 đã có hiệu lực từ 01/03/2026, thay thế phiên bản cũ bảo hành 6 tháng.",
  freshnessState: "fresh",
  freshnessLabel: "Chính sách v2 — hiệu lực từ 01/03/2026",
  citations: [
    {
      title: "Chính sách bảo hành giày da cao cấp (v2) — knw-006",
      excerpt:
        "Lỗi đế do sản xuất: bảo hành 12 tháng kể từ ngày mua. Lỗi da do sản xuất: bảo hành 6 tháng. Điều kiện: xuất trình hóa đơn, sản phẩm còn nguyên tem nhãn, lỗi được xác định là lỗi sản xuất.",
    },
    {
      title: "Trường hợp không được bảo hành",
      excerpt:
        "Lỗi do sử dụng không đúng cách, sản phẩm đã qua sửa chữa bên ngoài, hết thời hạn bảo hành, hoặc không có hóa đơn mua hàng.",
    },
    {
      title: "Quy trình bảo hành",
      excerpt:
        "Mang sản phẩm đến cửa hàng BQ gần nhất. Nhân viên kiểm tra và xác nhận lỗi. Chuyển về trung tâm bảo hành trong 3 ngày. Trả hàng sau bảo hành trong 7–10 ngày làm việc.",
    },
  ],
  sourceTrace: [
    {
      id: "src-401",
      title: "Chính sách bảo hành giày da cao cấp (v2) — knw-006",
      source: "M08 Knowledge Center",
      freshness: "Published 2026-03-01 08:00",
      trust: "High",
      excerpt:
        "Phiên bản mới nhất — thay thế knw-005 (v1 bảo hành 6 tháng đế). Phê duyệt bởi Giám đốc CSKH ngày 28/02/2026.",
    },
    {
      id: "src-402",
      title: "Chính sách bảo hành giày da cao cấp (v1) — knw-005 [Superseded]",
      source: "M08 Knowledge Center",
      freshness: "Superseded 2026-03-01",
      trust: "Low",
      excerpt:
        "Phiên bản cũ: bảo hành 6 tháng cho lỗi đế, 3 tháng cho lỗi da. ĐÃ BỊ THAY THẾ — không sử dụng phiên bản này.",
    },
  ],
  nextActions: ["Xem nguồn", "Hỏi tiếp", "Tạo yêu cầu hỗ trợ"],
};

// ---------------------------------------------------------------------------
// Scenario 13 — Mixed (đại lý + chiết khấu Q2/2026)
// ---------------------------------------------------------------------------
const scenarioAgentDiscount: AnswerScenario = {
  id: "mixed-agent-discount",
  prompt: "Đại lý cấp 1 được chiết khấu bao nhiêu trong Q2/2026?",
  answerType: "Mixed",
  summary:
    "Đại lý cấp 1 được hưởng chiết khấu 15% trên giá niêm yết trong Q2/2026, với điều kiện đơn hàng tối thiểu 50 triệu/tháng và thanh toán trong vòng 30 ngày. Chính sách không áp dụng cùng các CTKM khác. Đại lý cấp 2 được chiết khấu 10%.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 08:00 hôm nay",
  dataPoints: [
    { label: "Đại lý cấp 1", value: "Chiết khấu 15%" },
    { label: "Đại lý cấp 2", value: "Chiết khấu 10%" },
    { label: "Đơn tối thiểu", value: "50 triệu/tháng" },
    { label: "Hạn thanh toán", value: "30 ngày từ ngày xuất HĐ" },
    { label: "Hiệu lực", value: "Q2/2026 (01/04 – 30/06/2026)" },
  ],
  citations: [
    {
      title: "Chính sách chiết khấu đại lý Q2/2026 — knw-001",
      excerpt:
        "Đại lý cấp 1: 15% trên giá niêm yết. Đại lý cấp 2: 10%. Điều kiện: đơn hàng tối thiểu 50 triệu/tháng. Không áp dụng cùng các chương trình khuyến mãi khác. Thanh toán trong vòng 30 ngày.",
    },
    {
      title: "Trường hợp loại trừ",
      excerpt:
        "Không áp dụng cho sản phẩm đang trong đợt sale-off, sản phẩm limited edition, và đơn hàng dưới mức tối thiểu.",
    },
  ],
  sourceTrace: [
    {
      id: "src-501",
      title: "Chính sách chiết khấu đại lý Q2/2026 — knw-001",
      source: "M08 Knowledge Center",
      freshness: "Published 2026-04-01 08:00",
      trust: "High",
      excerpt:
        "Phê duyệt bởi Trưởng phòng Kinh doanh đại lý. Áp dụng toàn quốc cho đại lý có hợp đồng còn hiệu lực tính đến 01/04/2026.",
    },
    {
      id: "src-502",
      title: "Danh sách đại lý đang hoạt động — SAP B1",
      source: "SAP B1",
      freshness: "Snapshot 2026-04-19 08:00",
      trust: "High",
      excerpt:
        "SAP B1 là nguồn chân lý cho phân loại đại lý cấp 1/cấp 2. Phân loại được xác nhận bởi phòng Kinh doanh và cập nhật theo quý.",
    },
  ],
  nextActions: ["Xem nguồn", "Hỏi tiếp", "Tạo yêu cầu hỗ trợ"],
};

// ---------------------------------------------------------------------------
// Scenario 14 — Policy (SOP kiểm kho cuối ngày)
// ---------------------------------------------------------------------------
const scenarioSOPStockCount: AnswerScenario = {
  id: "policy-sop-stock-count",
  prompt: "Quy trình kiểm kho cuối ngày là gì?",
  answerType: "Policy",
  summary:
    "Quy trình kiểm kho cuối ngày gồm 5 bước bắt buộc: chạy báo cáo tồn kho từ KiotViet, đếm hàng vật lý tại kho và quầy, đối chiếu số liệu, điều chỉnh sai lệch nhỏ có ghi chú, và lưu phiếu kiểm kho gửi báo cáo cho quản lý vùng trước 22:00.",
  freshnessState: "fresh",
  freshnessLabel: "Cập nhật 2 tuần trước",
  citations: [
    {
      title: "SOP kiểm kho cuối ngày — knw-011",
      excerpt:
        "Thực hiện bắt buộc trước khi đóng ca tối. Cần ít nhất 2 nhân viên ký xác nhận phiếu kiểm kho. Chênh lệch trên 2 đôi/SKU phải báo Quản lý cửa hàng.",
    },
    {
      title: "Ngưỡng điều chỉnh tồn kho cho phép",
      excerpt:
        "Sai lệch ≤ 1 đôi/SKU do lỗi nhập liệu: nhân viên được phép điều chỉnh trong KiotViet kèm ghi chú lý do cụ thể. Sai lệch > 1 đôi cần phê duyệt từ Quản lý cửa hàng.",
    },
    {
      title: "Hạn nộp báo cáo",
      excerpt:
        "Scan phiếu kiểm kho vật lý và upload lên hệ thống. Gửi email tóm tắt cho Quản lý vùng trước 22:00 mỗi ngày. Ngày cuối tháng: gửi kèm báo cáo đối soát tháng.",
    },
  ],
  sourceTrace: [
    {
      id: "src-601",
      title: "SOP kiểm kho cuối ngày — knw-011",
      source: "M08 Knowledge Center",
      freshness: "Reviewed 2026-04-10 17:00",
      trust: "High",
      excerpt:
        "Phê duyệt bởi Ops Lead. Áp dụng cho tất cả cửa hàng trực thuộc BQ. Đại lý thực hiện theo quy định riêng trong hợp đồng.",
    },
    {
      id: "src-602",
      title: "Hướng dẫn chạy báo cáo tồn kho — KiotViet",
      source: "M08 Knowledge Center",
      freshness: "Reviewed 2026-04-05 10:00",
      trust: "High",
      excerpt:
        "Vào Báo cáo → Tồn kho → Chọn ngày hôm nay → Xuất danh sách SKU và số lượng. Đảm bảo chạy báo cáo sau lần giao dịch cuối cùng trong ngày.",
    },
  ],
  nextActions: ["Xem nguồn", "Tải checklist PDF", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Scenario 15 — Data (tổng tồn kho toàn hệ thống theo dòng sản phẩm)
// ---------------------------------------------------------------------------
const scenarioInventorySummary: AnswerScenario = {
  id: "data-inventory-summary",
  prompt: "Tổng tồn kho dòng giày da nam trên toàn hệ thống hiện là bao nhiêu?",
  answerType: "Data",
  summary:
    "Tổng tồn kho dòng giày da nam trên toàn hệ thống (43 tỉnh thành) hiện là 3.840 đôi, trong đó 420 đôi đang được reserved cho đơn đang xử lý. Kho trung tâm TP.HCM chiếm 38%, kho miền Bắc 31%, kho miền Trung 18%, và kho online 13%.",
  freshnessState: "stale",
  freshnessLabel: "Tổng hợp từ đêm qua — có thể lệch nhẹ",
  warning:
    "Số liệu tổng hợp từ báo cáo đêm qua (23:00 ngày 18/04). Giao dịch đầu ngày hôm nay chưa được phản ánh đầy đủ. Dữ liệu thời gian thực theo từng kho: tra cứu trực tiếp trên KiotViet.",
  dataPoints: [
    { label: "Tổng tồn toàn hệ thống", value: "3.840 đôi" },
    { label: "Reserved (đang xử lý)", value: "420 đôi" },
    { label: "Khả dụng thực tế", value: "3.420 đôi" },
    { label: "Kho TP.HCM (trung tâm)", value: "1.459 đôi" },
    { label: "Kho Hà Nội", value: "1.190 đôi" },
    { label: "Kho Đà Nẵng", value: "691 đôi" },
    { label: "Kho online (Haravan)", value: "500 đôi" },
  ],
  sourceTrace: [
    {
      id: "src-701",
      title: "Daily Inventory Report — Giày da nam (KiotViet)",
      source: "KiotViet",
      freshness: "Report 2026-04-18 23:00",
      trust: "Medium",
      excerpt:
        "Tổng hợp tồn kho dòng Giày da nam toàn hệ thống tính đến cuối ngày 18/04. Báo cáo tự động chạy lúc 23:00 hằng đêm.",
    },
    {
      id: "src-702",
      title: "Warehouse Summary — SAP B1",
      source: "SAP B1",
      freshness: "Snapshot 2026-04-19 00:30",
      trust: "High",
      excerpt:
        "SAP B1 báo cáo tồn kho kho trung tâm sau điều chỉnh đêm: 1.459 đôi tại TP.HCM. Số liệu SAP là nguồn tham chiếu cho báo cáo tài chính.",
    },
    {
      id: "src-703",
      title: "Haravan Online Inventory",
      source: "Haravan",
      freshness: "Snapshot 2026-04-19 09:00",
      trust: "High",
      excerpt:
        "Kho online (giaybq.com.vn): 500 đôi giày da nam hiện đang available. Không có reserved tại thời điểm snapshot.",
    },
  ],
  nextActions: ["Xem nguồn", "Kiểm tra SKU cụ thể", "Hỏi tiếp"],
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const INTERNAL_CHAT_SCENARIOS: AnswerScenario[] = [
  scenarioInventoryBQ2301,
  scenarioCTKMCuaHang,
  scenarioPriceBQ1102,
  scenarioOrderStatus,
  scenarioPolicyReturn,
  scenarioDataInventory,
  scenarioMixedOrderPolicy,
  scenarioBlockedPricing,
  scenarioPolicySOP,
  scenarioDataConflict,
  scenarioMixedPromoInventory,
  scenarioUnsupported,
  scenarioInventoryBySKU,
  scenarioPricingRetail,
  scenarioPolicyWarranty,
  scenarioAgentDiscount,
  scenarioSOPStockCount,
  scenarioInventorySummary,
];

/** 4 câu hỏi mẫu đặc trưng của nhân viên BQ — dùng làm prompt chips */
export const BQ_PROMPT_CHIPS = [
  "Mã BQ-2301 size 40 màu đen còn bao nhiêu tại kho Hà Nội?",
  "CTKM tháng này áp dụng cho cửa hàng chính hãng gồm những gì?",
  "Giá bán lẻ hiện tại của mã BQ-1102 là bao nhiêu?",
  "Đơn hàng #98765 đang ở trạng thái nào?",
];

export function inferScenarioFromPrompt(prompt: string): AnswerScenario {
  const p = prompt.toLowerCase();

  // Specific SKU inventory lookup (BQ-XXXX pattern or explicit SKU mention)
  if (p.match(/bq-\d{4}/) || (p.includes("size") && p.includes("kho"))) {
    return scenarioInventoryBySKU;
  }

  // Order status lookup
  if (p.match(/#\d{4,}/) || (p.includes("đơn") && p.includes("trạng thái"))) {
    return scenarioOrderStatus;
  }

  // Retail price lookup
  if (
    (p.includes("giá bán") ||
      p.includes("giá bán lẻ") ||
      p.includes("giá niêm yết")) &&
    !p.includes("nội bộ") &&
    !p.includes("toàn bộ")
  ) {
    return scenarioPricingRetail;
  }

  // Agent discount
  if (
    p.includes("đại lý") &&
    (p.includes("chiết khấu") || p.includes("q2") || p.includes("quý"))
  ) {
    return scenarioAgentDiscount;
  }

  // Warranty policy
  if (p.includes("bảo hành") || p.includes("warranty")) {
    return scenarioPolicyWarranty;
  }

  // SOP stock count / end of day
  if (
    p.includes("kiểm kho") ||
    p.includes("cuối ngày") ||
    p.includes("đối soát")
  ) {
    return scenarioSOPStockCount;
  }

  // Inventory summary by product line
  if (
    p.includes("toàn hệ thống") ||
    p.includes("tổng tồn") ||
    (p.includes("tồn kho") && p.includes("dòng"))
  ) {
    return scenarioInventorySummary;
  }

  // Policy — return/exchange
  if (
    p.includes("đổi trả") ||
    p.includes("hoàn tiền") ||
    p.includes("đổi hàng")
  ) {
    return scenarioPolicyReturn;
  }

  // SOP — store operation
  if (
    p.includes("sop") ||
    p.includes("mở cửa") ||
    p.includes("quy trình") ||
    p.includes("checklist")
  ) {
    return scenarioPolicySOP;
  }

  if (
    p.includes("policy") ||
    p.includes("chính sách") ||
    p.includes("quy định")
  ) {
    return scenarioPolicyReturn;
  }

  // Data — conflict
  if (
    p.includes("mâu thuẫn") ||
    p.includes("không đồng nhất") ||
    p.includes("kho trung tâm") ||
    p.includes("bq-1842")
  ) {
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
  if (
    p.includes("ctkm") ||
    p.includes("khuyến mãi") ||
    p.includes("giảm giá")
  ) {
    return scenarioMixedPromoInventory;
  }

  // Mixed — order + shipping
  if (
    p.includes("giao hàng") ||
    p.includes("vận chuyển") ||
    p.includes("order")
  ) {
    return scenarioMixedOrderPolicy;
  }

  if (
    p.includes("đơn") &&
    (p.includes("online") || p.includes("hd-") || p.includes("ở đâu"))
  ) {
    return scenarioMixedOrderPolicy;
  }

  // Blocked
  if (p.includes("chiết khấu") && !p.includes("đại lý")) {
    return scenarioBlockedPricing;
  }
  if (
    p.includes("giá nội bộ") ||
    p.includes("discount matrix") ||
    p.includes("ma trận giá")
  ) {
    return scenarioBlockedPricing;
  }
  if (
    p.includes("giá") &&
    (p.includes("nội bộ") || p.includes("toàn bộ rule"))
  ) {
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

  // Default fallback
  return scenarioPolicyReturn;
}
