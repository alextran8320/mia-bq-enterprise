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
  nextActions: ["Xem nguồn", "Kiểm tra size khác", "Kiểm tra kho TP.HCM", "Tạo yêu cầu hỗ trợ"],
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
  nextActions: ["Xem nguồn", "Kiểm tra CTKM online", "Hỏi tiếp", "Tạo yêu cầu hỗ trợ"],
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
    { label: "Bảng giá áp dụng", value: "BG-2026-001 — Bán lẻ tiêu chuẩn 2026" },
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
  nextActions: ["Xem nguồn", "Kiểm tra giá đại lý", "Kiểm tra tồn kho BQ-1102", "Hỏi tiếp"],
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
  nextActions: ["Xem nguồn", "Kiểm tra đơn khác", "Tạo yêu cầu hỗ trợ", "Gửi phản hồi"],
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
  prompt: "Đơn online #HD-2048 đang ở đâu và chính sách giao hàng áp dụng thế nào?",
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
  prompt: "Tồn kho Giày da nam BQ Classic (BQ-1842) màu đen size 42 tại kho trung tâm là bao nhiêu?",
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

  // Các mã SKU BQ cụ thể
  if (p.includes("bq-2301") && (p.includes("hà nội") || p.includes("size") || p.includes("còn"))) {
    return scenarioInventoryBQ2301;
  }
  if (p.includes("bq-1102") || p.includes("giá bán lẻ") || p.includes("giá hiện tại")) {
    return scenarioPriceBQ1102;
  }

  // Đơn hàng cụ thể
  if (p.includes("#98765") || p.includes("98765")) {
    return scenarioOrderStatus;
  }

  // CTKM cửa hàng
  if ((p.includes("ctkm") || p.includes("khuyến mãi")) && (p.includes("cửa hàng") || p.includes("chính hãng") || p.includes("tháng này"))) {
    return scenarioCTKMCuaHang;
  }

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
  if (p.includes("mâu thuẫn") || p.includes("không đồng nhất") || p.includes("kho trung tâm") || p.includes("bq-1842")) {
    return scenarioDataConflict;
  }

  // Data — inventory
  if (p.includes("còn hàng") || p.includes("tồn kho") || p.includes("ở đâu") || p.includes("còn bao nhiêu") || p.includes("stock")) {
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
  if (p.includes("dự báo") || p.includes("forecast") || p.includes("doanh thu tháng") || p.includes("kế hoạch kinh doanh")) {
    return scenarioUnsupported;
  }

  // Default fallback
  return scenarioPolicyReturn;
}
