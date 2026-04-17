export type OperationsFilterStatus = "all" | "attention" | "active" | "resolved";
export type OperationsDomain =
  | "all"
  | "inventory"
  | "pricing"
  | "policy"
  | "customer"
  | "access"
  | "integration";

export type OperationsMetricTone = "default" | "success" | "warning" | "danger";
export type OperationsWarningState = "none" | "attention" | "blocked" | "restricted";

export interface OperationsFilters {
  query: string;
  status: OperationsFilterStatus;
  domain: OperationsDomain;
}

export interface OperationsQuickQuery {
  label: string;
  query: string;
}

export interface OperationsOverviewMetric {
  id: string;
  label: string;
  value: string;
  tone: OperationsMetricTone;
}

export interface OperationsPageSummary {
  title: string;
  description: string;
  count: number;
  countLabel: string;
  badges: string[];
}

export interface EscalationTimelineItem {
  id: string;
  time: string;
  title: string;
  owner: string;
  note: string;
}

export interface EscalationRecord {
  id: string;
  subject: string;
  domain: Exclude<OperationsDomain, "all">;
  sourceModule: string;
  actor: string;
  actorRole: string;
  assignee: string;
  statusLabel: string;
  statusGroup: Exclude<OperationsFilterStatus, "all">;
  destinationLabel: string;
  destinationRef: string;
  createdAt: string;
  ageLabel: string;
  warningState: OperationsWarningState;
  summary: string;
  question: string;
  answerSnapshot: string;
  blockedReason: string;
  nextAction: string;
  tags: string[];
  timeline: EscalationTimelineItem[];
}

export interface ScopeAssignment {
  label: string;
  values: string[];
}

export interface UserScopeProfile {
  id: string;
  name: string;
  role: string;
  ownerTeam: string;
  statusLabel: string;
  statusGroup: Exclude<OperationsFilterStatus, "all">;
  warningState: OperationsWarningState;
  updatedAt: string;
  branchSummary: string;
  note: string;
  reviewNote: string;
  modes: string[];
  scopeAssignments: ScopeAssignment[];
}

export interface GovernanceRuleRecord {
  id: string;
  title: string;
  categoryLabel: string;
  categoryKey: "scope" | "sensitivity" | "public_safe";
  roleLabel: string;
  modeLabel: string;
  domain: Exclude<OperationsDomain, "all">;
  statusLabel: string;
  statusGroup: Exclude<OperationsFilterStatus, "all">;
  warningState: OperationsWarningState;
  updatedAt: string;
  owner: string;
  affectedAreas: string[];
  hiddenFields: string[];
  previewBefore: string;
  previewAfter: string;
  note: string;
}

export interface ConnectorRun {
  id: string;
  label: string;
  statusLabel: string;
  duration: string;
  startedAt: string;
  note: string;
}

export interface ConnectorHealthRecord {
  id: string;
  name: string;
  domain: Exclude<OperationsDomain, "all">;
  statusLabel: string;
  statusGroup: Exclude<OperationsFilterStatus, "all">;
  warningState: OperationsWarningState;
  lastRun: string;
  successRate: string;
  retryQueue: string;
  deadLetter: string;
  webhookBacklog: string;
  owner: string;
  nextAction: string;
  note: string;
  sourceSystems: string[];
  recentRuns: ConnectorRun[];
}

export interface MappingValuePair {
  id: string;
  system: string;
  label: string;
  value: string;
  syncedAt: string;
}

export interface MappingConflictRecord {
  id: string;
  entityType: string;
  canonicalKey: string;
  domain: Exclude<OperationsDomain, "all">;
  statusLabel: string;
  statusGroup: Exclude<OperationsFilterStatus, "all">;
  warningState: OperationsWarningState;
  owner: string;
  updatedAt: string;
  conflictReason: string;
  nextAction: string;
  activeRule: string;
  reviewNote: string;
  sourceValues: MappingValuePair[];
}

export const OPERATIONS_QUICK_QUERIES: OperationsQuickQuery[] = [
  { label: "Escalation tồn kho", query: "tồn kho" },
  { label: "Vai trò đại lý", query: "đại lý" },
  { label: "Haravan retry", query: "Haravan" },
  { label: "Conflict mã đơn", query: "đơn hàng" },
];

export const ESCALATION_RECORDS: EscalationRecord[] = [
  {
    id: "ESC-240416-018",
    subject: "Tồn kho Flagship Q1 và KiotViet lệch 3 đôi",
    domain: "inventory",
    sourceModule: "Order Summary",
    actor: "Nguyễn Minh Quân",
    actorRole: "CSKH online",
    assignee: "Logistics miền Nam",
    statusLabel: "Đang xử lý",
    statusGroup: "active",
    destinationLabel: "Lark Workflow",
    destinationRef: "LK-OPS-01892",
    createdAt: "16/04 • 20:14",
    ageLabel: "1 giờ 54 phút",
    warningState: "attention",
    summary:
      "Khách hỏi giữ hàng tại Flagship Q1 nhưng tồn realtime và tồn đồng bộ chưa khớp nhau.",
    question:
      "Mẫu Sneaker Velocity size 39 còn đúng 3 đôi ở Flagship Q1 không để em giữ cho khách lấy tối nay?",
    answerSnapshot:
      "Hệ thống đang ghi nhận 5 đôi tại cửa hàng, tuy nhiên nguồn POS gần nhất mới cập nhật cách đây 18 phút.",
    blockedReason:
      "Nguồn SAP B1 và KiotViet chưa đồng nhất nên không thể cam kết giữ hàng ngay trong câu trả lời tự động.",
    nextAction:
      "Kiểm tra lại tồn realtime tại Flagship Q1 và xác nhận với CSKH trước 22:30.",
    tags: ["Inventory", "Realtime check", "Store hold"],
    timeline: [
      {
        id: "esc-018-1",
        time: "20:14",
        title: "Tạo escalation",
        owner: "MIABOS",
        note: "Answer confidence dưới ngưỡng an toàn nên người dùng chọn chuyển tiếp.",
      },
      {
        id: "esc-018-2",
        time: "20:15",
        title: "Gán người xử lý",
        owner: "Workflow rule",
        note: "Domain inventory được route về Logistics miền Nam.",
      },
      {
        id: "esc-018-3",
        time: "21:02",
        title: "Đã nhận xử lý",
        owner: "Phạm Hồng Hải",
        note: "Đang xác nhận tồn tại cửa hàng trước khi phản hồi lại CSKH.",
      },
    ],
  },
  {
    id: "ESC-240416-011",
    subject: "Giá đại lý bị chặn ở vai trò cửa hàng chính hãng",
    domain: "pricing",
    sourceModule: "Sales Advisor AI",
    actor: "Lê Mỹ Tiên",
    actorRole: "Quản lý cửa hàng",
    assignee: "Pricing Control",
    statusLabel: "Chờ phân công",
    statusGroup: "attention",
    destinationLabel: "Internal queue",
    destinationRef: "INT-PRC-443",
    createdAt: "16/04 • 18:42",
    ageLabel: "3 giờ 26 phút",
    warningState: "restricted",
    summary:
      "Người dùng yêu cầu xem giá đại lý cho mã giày nhưng vai trò hiện tại chỉ được xem giá bán lẻ áp dụng.",
    question:
      "Mã Loafer Heritage màu đen hiện đang áp giá đại lý bao nhiêu để em đối chiếu?",
    answerSnapshot:
      "Hệ thống chỉ hiển thị giá bán áp dụng cho cửa hàng chính hãng trong phạm vi hiện tại.",
    blockedReason:
      "Giá đại lý và biên lợi nhuận là thông tin bị giới hạn theo role và store type.",
    nextAction:
      "Pricing Control kiểm tra scope của user và xác nhận có cần mở escalation sang quyền đặc biệt hay không.",
    tags: ["Pricing", "Dealer scope", "Access"],
    timeline: [
      {
        id: "esc-011-1",
        time: "18:42",
        title: "Tạo manual escalation",
        owner: "Lê Mỹ Tiên",
        note: "Người dùng chủ động yêu cầu xác nhận với bộ phận pricing.",
      },
      {
        id: "esc-011-2",
        time: "18:43",
        title: "Fallback queue",
        owner: "MIABOS",
        note: "Lark connector đang retry nên ticket được lưu ở hàng đợi nội bộ.",
      },
    ],
  },
  {
    id: "ESC-240416-006",
    subject: "Chính sách bảo hành online chưa đủ public-safe",
    domain: "policy",
    sourceModule: "Internal AI Chat",
    actor: "Phan Bảo Ngọc",
    actorRole: "Ecommerce",
    assignee: "Policy & Service",
    statusLabel: "Đã giải quyết",
    statusGroup: "resolved",
    destinationLabel: "Lark Workflow",
    destinationRef: "LK-KNW-221",
    createdAt: "16/04 • 15:08",
    ageLabel: "6 giờ 58 phút",
    warningState: "none",
    summary:
      "Bản trả lời về bảo hành đổi quai túi chưa nằm trong danh sách public-safe nên cần xác nhận với đội chính sách.",
    question:
      "Khách mua online quai túi bị tróc sau 20 ngày thì cửa hàng có đổi tại chỗ được không?",
    answerSnapshot:
      "Hệ thống ghi nhận chính sách bảo hành trọn đời cho lỗi keo/chỉ nhưng chưa xác nhận rõ với trường hợp phụ kiện quai túi online.",
    blockedReason:
      "Chính sách chi tiết theo trường hợp chưa được publish ở mức dùng cho tư vấn rộng.",
    nextAction:
      "Giữ lại làm mẫu reference cho đội chính sách và đưa vào batch publish tiếp theo.",
    tags: ["Policy", "Public-safe", "Warranty"],
    timeline: [
      {
        id: "esc-006-1",
        time: "15:08",
        title: "Auto escalation",
        owner: "MIABOS",
        note: "Rule public-safe chặn answer vì thiếu điều khoản áp dụng theo kênh online.",
      },
      {
        id: "esc-006-2",
        time: "16:00",
        title: "Được assign",
        owner: "Workflow rule",
        note: "Domain policy chuyển sang đội Policy & Service.",
      },
      {
        id: "esc-006-3",
        time: "17:24",
        title: "Đã xác nhận",
        owner: "Đội Policy & Service",
        note: "Thêm ghi chú áp dụng cho online và mark resolved.",
      },
    ],
  },
  {
    id: "ESC-240416-003",
    subject: "Khách loyalty trùng số điện thoại giữa Haravan và CRM",
    domain: "customer",
    sourceModule: "Customer 360",
    actor: "Trương Nhật Hạ",
    actorRole: "CRM operator",
    assignee: "Data Steward",
    statusLabel: "Cần đối soát",
    statusGroup: "attention",
    destinationLabel: "Lark Workflow",
    destinationRef: "LK-DATA-071",
    createdAt: "16/04 • 13:20",
    ageLabel: "8 giờ 46 phút",
    warningState: "blocked",
    summary:
      "Hai hồ sơ loyalty đang dùng cùng số điện thoại và tạo ra answer không nhất quán về hạng thành viên.",
    question:
      "Khách này hiện là Bạc hay Vàng? Sao hệ thống đang hiện 2 hạng khác nhau?",
    answerSnapshot:
      "Haravan ghi nhận hạng Vàng nhưng CRM nội bộ đang ghép số điện thoại với một hồ sơ Bạc khác.",
    blockedReason:
      "Canonical customer map chưa resolve xong nên không thể kết luận hạng thành viên.",
    nextAction:
      "Data Steward xử lý mapping khách hàng trước 10:00 sáng mai để mở lại Customer 360.",
    tags: ["Customer", "Canonical map", "Loyalty"],
    timeline: [
      {
        id: "esc-003-1",
        time: "13:20",
        title: "Tạo escalation",
        owner: "Trương Nhật Hạ",
        note: "Người dùng phát hiện loyalty tier mismatch trong lúc hỗ trợ CSKH.",
      },
      {
        id: "esc-003-2",
        time: "13:22",
        title: "De-duplicate check",
        owner: "MIABOS",
        note: "Không phát hiện escalation trùng trong 30 phút gần nhất.",
      },
    ],
  },
];

export const USER_SCOPE_PROFILES: UserScopeProfile[] = [
  {
    id: "USR-SCP-011",
    name: "Lê Mỹ Tiên",
    role: "Quản lý cửa hàng",
    ownerTeam: "Retail Operations",
    statusLabel: "Đang áp dụng",
    statusGroup: "active",
    warningState: "none",
    updatedAt: "16/04 • 14:10",
    branchSummary: "3 cửa hàng chính hãng tại TP.HCM",
    note:
      "Vai trò được xem tồn và giá bán áp dụng tại cụm cửa hàng phụ trách, nhưng không được mở giá đại lý.",
    reviewNote:
      "Rule phù hợp với phase 1, chưa có yêu cầu mở rộng thêm quyền pricing.",
    modes: ["Internal", "Escalation-only cho dealer pricing"],
    scopeAssignments: [
      { label: "Chi nhánh", values: ["Flagship Q1", "Vincom Thủ Đức", "Giga Mall"] },
      { label: "Kênh", values: ["Cửa hàng chính hãng"] },
      { label: "Store type", values: ["Official store"] },
    ],
  },
  {
    id: "USR-SCP-018",
    name: "Nguyễn Minh Quân",
    role: "CSKH online",
    ownerTeam: "Customer Care",
    statusLabel: "Cần rà soát",
    statusGroup: "attention",
    warningState: "attention",
    updatedAt: "16/04 • 19:35",
    branchSummary: "Toàn quốc cho online, không có POS detail",
    note:
      "Vai trò được xem order summary và chính sách đổi trả, nhưng không được truy cập giá nhập và journal tài chính.",
    reviewNote:
      "Đã phát hiện 1 request mở rộng ngoài scope cho case tồn theo cửa hàng, cần chốt rõ thêm với Logistics.",
    modes: ["Internal", "Public-safe preview"],
    scopeAssignments: [
      { label: "Chi nhánh", values: ["Online toàn quốc"] },
      { label: "Kênh", values: ["Website", "Social commerce", "Marketplace"] },
      { label: "Store type", values: ["Ecommerce"] },
    ],
  },
  {
    id: "USR-SCP-023",
    name: "Phạm Hồng Hải",
    role: "Logistics lead",
    ownerTeam: "Logistics miền Nam",
    statusLabel: "Đang áp dụng",
    statusGroup: "active",
    warningState: "none",
    updatedAt: "16/04 • 17:12",
    branchSummary: "Kho Tân Bình + 12 cửa hàng miền Nam",
    note:
      "Vai trò được xem tồn theo kho/cửa hàng, luồng điều chuyển và escalation tồn kho, nhưng không thấy thông tin khách hàng nhạy cảm.",
    reviewNote:
      "Scope khá ổn định, chỉ cần đồng bộ naming store với source mapping.",
    modes: ["Internal"],
    scopeAssignments: [
      { label: "Chi nhánh", values: ["Kho Tân Bình", "Cụm miền Nam"] },
      { label: "Kênh", values: ["Cửa hàng", "POS", "Điều chuyển nội bộ"] },
      { label: "Store type", values: ["Official store", "Warehouse"] },
    ],
  },
  {
    id: "USR-SCP-031",
    name: "Phan Bảo Ngọc",
    role: "Ecommerce operator",
    ownerTeam: "Omnichannel",
    statusLabel: "Giới hạn quyền",
    statusGroup: "attention",
    warningState: "restricted",
    updatedAt: "16/04 • 11:50",
    branchSummary: "Omnichannel, không bao gồm đại lý",
    note:
      "Vai trò chỉ được xem giá và khuyến mãi online. Chính sách nội bộ cho đại lý và margin bị chặn hoàn toàn.",
    reviewNote:
      "Giữ nguyên cho vòng demo khách, tránh lộ pricing đặc biệt ngoài ecommerce.",
    modes: ["Internal", "Sales-safe review"],
    scopeAssignments: [
      { label: "Chi nhánh", values: ["Omnichannel hub"] },
      { label: "Kênh", values: ["Website", "Haravan", "Social commerce"] },
      { label: "Store type", values: ["Ecommerce"] },
    ],
  },
  {
    id: "USR-SCP-040",
    name: "Võ Hữu Tâm",
    role: "Pricing controller",
    ownerTeam: "Finance & Pricing",
    statusLabel: "Đang áp dụng",
    statusGroup: "active",
    warningState: "none",
    updatedAt: "16/04 • 09:22",
    branchSummary: "HQ + dealer review",
    note:
      "Vai trò được xem giá cơ sở, giá đại lý, chênh lệch CTKM và escalation pricing toàn hệ thống.",
    reviewNote:
      "Đây là role chuẩn để làm owner cho pricing escalations và source priority rules.",
    modes: ["Internal", "Governance"],
    scopeAssignments: [
      { label: "Chi nhánh", values: ["HQ", "Dealer review"] },
      { label: "Kênh", values: ["Official", "Dealer", "Ecommerce"] },
      { label: "Store type", values: ["Official store", "Dealer", "HQ"] },
    ],
  },
];

export const GOVERNANCE_RULES: GovernanceRuleRecord[] = [
  {
    id: "RULE-SEC-101",
    title: "Ẩn giá đại lý với vai trò cửa hàng chính hãng",
    categoryLabel: "Nhạy cảm",
    categoryKey: "sensitivity",
    roleLabel: "Quản lý cửa hàng",
    modeLabel: "Internal",
    domain: "pricing",
    statusLabel: "Đang áp dụng",
    statusGroup: "active",
    warningState: "none",
    updatedAt: "16/04 • 10:40",
    owner: "Finance & Pricing",
    affectedAreas: ["Pricing Center", "Sales Advisor AI"],
    hiddenFields: ["Giá đại lý", "Margin", "Landed cost"],
    previewBefore:
      "Mã Loafer Heritage đang áp giá đại lý 1.280.000đ, margin 18,4%.",
    previewAfter:
      "Hệ thống chỉ hiển thị giá bán áp dụng cho cửa hàng chính hãng trong phạm vi hiện tại.",
    note:
      "Rule nền cho phase 1 để tránh lộ giá đặc thù giữa official store và dealer.",
  },
  {
    id: "RULE-SCP-203",
    title: "CSKH online chỉ xem tồn tham chiếu theo kênh online",
    categoryLabel: "Phạm vi",
    categoryKey: "scope",
    roleLabel: "CSKH online",
    modeLabel: "Internal",
    domain: "inventory",
    statusLabel: "Cần tinh chỉnh",
    statusGroup: "attention",
    warningState: "attention",
    updatedAt: "16/04 • 18:05",
    owner: "Customer Care + Logistics",
    affectedAreas: ["Order Summary", "Inventory Availability"],
    hiddenFields: ["Tồn realtime theo POS", "Slot điều chuyển nội bộ"],
    previewBefore:
      "Flagship Q1 còn 5 đôi, Kho Tân Bình còn 17 đôi và lịch điều chuyển sáng mai đã được giữ.",
    previewAfter:
      "Hiện có tồn tham chiếu để tư vấn cho khách, trường hợp giữ hàng hoặc điều chuyển sẽ được xác nhận thêm bởi đội vận hành.",
    note:
      "Cần chốt thêm matrix theo branch/store type nếu mở rộng cho cụm CSKH gọi điện cửa hàng.",
  },
  {
    id: "RULE-PSF-018",
    title: "Whitelist public-safe cho bảo hành trọn đời",
    categoryLabel: "Công khai an toàn",
    categoryKey: "public_safe",
    roleLabel: "External chatbot",
    modeLabel: "Sales-safe",
    domain: "policy",
    statusLabel: "Đang áp dụng",
    statusGroup: "active",
    warningState: "none",
    updatedAt: "16/04 • 16:32",
    owner: "Policy & Service",
    affectedAreas: ["Internal AI Chat", "Sales Advisor AI"],
    hiddenFields: ["Quy trình nội bộ chuyển xưởng", "SLA ngoại lệ theo cửa hàng"],
    previewBefore:
      "Lỗi keo/chỉ được bảo hành trọn đời, trường hợp cần chuyển xưởng sẽ theo quy trình nội bộ 4 bước.",
    previewAfter:
      "Lỗi keo/chỉ nằm trong chính sách bảo hành trọn đời. Trường hợp cần kiểm tra thêm sẽ được cửa hàng tiếp nhận và hướng dẫn chi tiết.",
    note:
      "Rule này dùng cho tư vấn rộng và được review định kỳ hàng tháng.",
  },
  {
    id: "RULE-SEC-144",
    title: "Mask thông tin loyalty khi mapping khách hàng chưa resolve",
    categoryLabel: "Nhạy cảm",
    categoryKey: "sensitivity",
    roleLabel: "CRM operator",
    modeLabel: "Internal",
    domain: "customer",
    statusLabel: "Đang chặn",
    statusGroup: "attention",
    warningState: "blocked",
    updatedAt: "16/04 • 13:28",
    owner: "Data Steward",
    affectedAreas: ["Customer 360", "Internal AI Chat"],
    hiddenFields: ["Loyalty tier", "Điểm tích lũy", "Reward balance"],
    previewBefore:
      "Khách đang ở hạng Vàng, còn 2.800 điểm thưởng và đủ điều kiện nâng hạng tháng này.",
    previewAfter:
      "Dữ liệu thành viên đang cần đối soát giữa các nguồn nên hệ thống chưa thể xác nhận hạng khách hàng lúc này.",
    note:
      "Rule tạm thời để tránh trả lời sai khi canonical customer map chưa thống nhất.",
  },
  {
    id: "RULE-SCP-260",
    title: "Đại lý chỉ xem ưu đãi và tồn trong vùng phụ trách",
    categoryLabel: "Phạm vi",
    categoryKey: "scope",
    roleLabel: "Dealer support",
    modeLabel: "Internal",
    domain: "access",
    statusLabel: "Đang áp dụng",
    statusGroup: "active",
    warningState: "restricted",
    updatedAt: "16/04 • 15:14",
    owner: "Channel Development",
    affectedAreas: ["Promotion Center", "Product Catalog"],
    hiddenFields: ["Ưu đãi riêng cho official store", "Tồn chi tiết cửa hàng ngoài vùng"],
    previewBefore:
      "Showroom Đà Nẵng đang có ưu đãi nội bộ riêng và Flagship Q1 còn đủ size 37-40 để điều chuyển.",
    previewAfter:
      "Hệ thống chỉ hiển thị các chương trình và nguồn hàng trong vùng đại lý đang phụ trách.",
    note:
      "Rule này còn phụ thuộc artifact M13 để chuẩn hóa vùng/chi nhánh theo channel.",
  },
];

export const CONNECTOR_HEALTH_RECORDS: ConnectorHealthRecord[] = [
  {
    id: "CONN-SAP",
    name: "SAP B1",
    domain: "integration",
    statusLabel: "Ổn định",
    statusGroup: "active",
    warningState: "none",
    lastRun: "16/04 • 21:55",
    successRate: "99,2%",
    retryQueue: "0 job",
    deadLetter: "0 bản ghi",
    webhookBacklog: "Không áp dụng",
    owner: "IT / ERP / data",
    nextAction: "Duy trì window đồng bộ 5 phút cho item master và tồn kho kho tổng.",
    note:
      "ERP vẫn là nguồn cấu trúc chuẩn cho item master, kho và giá cơ sở.",
    sourceSystems: ["Item master", "Warehouse", "Base pricing", "ERP partner"],
    recentRuns: [
      {
        id: "run-sap-1",
        label: "Inventory delta sync",
        statusLabel: "Thành công",
        duration: "42 giây",
        startedAt: "21:55",
        note: "Không có record conflict mới.",
      },
      {
        id: "run-sap-2",
        label: "Product master refresh",
        statusLabel: "Thành công",
        duration: "1 phút 12 giây",
        startedAt: "21:10",
        note: "2 SKU đổi tên thương mại được cập nhật.",
      },
    ],
  },
  {
    id: "CONN-HAR",
    name: "Haravan",
    domain: "integration",
    statusLabel: "Đang cảnh báo",
    statusGroup: "attention",
    warningState: "attention",
    lastRun: "16/04 • 21:48",
    successRate: "93,4%",
    retryQueue: "4 job",
    deadLetter: "1 webhook",
    webhookBacklog: "7 sự kiện",
    owner: "Omnichannel",
    nextAction:
      "Xử lý webhook đơn hàng trả về bị timeout và dọn retry queue trước 23:00.",
    note:
      "Nguồn ecommerce đang có backlog nhẹ ở nhóm order update và loyalty event.",
    sourceSystems: ["Online orders", "Customer online", "Loyalty", "Promotion online"],
    recentRuns: [
      {
        id: "run-har-1",
        label: "Order webhook replay",
        statusLabel: "Retry",
        duration: "2 phút 18 giây",
        startedAt: "21:48",
        note: "1 job cần replay do timeout từ phía webhook endpoint.",
      },
      {
        id: "run-har-2",
        label: "Loyalty snapshot sync",
        statusLabel: "Thành công",
        duration: "58 giây",
        startedAt: "21:05",
        note: "Không phát sinh duplicate profile mới.",
      },
    ],
  },
  {
    id: "CONN-KV",
    name: "KiotViet",
    domain: "integration",
    statusLabel: "Ổn định",
    statusGroup: "active",
    warningState: "none",
    lastRun: "16/04 • 21:57",
    successRate: "98,7%",
    retryQueue: "1 job",
    deadLetter: "0 bản ghi",
    webhookBacklog: "2 sự kiện",
    owner: "Retail Ops",
    nextAction:
      "Theo dõi thêm delta POS tại Flagship Q1 vì vừa có một lần đồng bộ chậm 18 phút.",
    note:
      "Đây là nguồn quan trọng cho POS, barcode và tồn theo cửa hàng.",
    sourceSystems: ["POS sales", "Store inventory", "Barcode", "Branch retail reporting"],
    recentRuns: [
      {
        id: "run-kv-1",
        label: "Store inventory sync",
        statusLabel: "Thành công",
        duration: "1 phút 04 giây",
        startedAt: "21:57",
        note: "Flagship Q1 có 1 store delta đến muộn nhưng đã được bù.",
      },
      {
        id: "run-kv-2",
        label: "Barcode refresh",
        statusLabel: "Thành công",
        duration: "27 giây",
        startedAt: "20:57",
        note: "Không có variant mới cần map tay.",
      },
    ],
  },
  {
    id: "CONN-LARK",
    name: "Lark Workflow",
    domain: "integration",
    statusLabel: "Gián đoạn cục bộ",
    statusGroup: "attention",
    warningState: "blocked",
    lastRun: "16/04 • 20:43",
    successRate: "88,1%",
    retryQueue: "6 job",
    deadLetter: "2 ticket",
    webhookBacklog: "Không áp dụng",
    owner: "Ops Governance",
    nextAction:
      "Kiểm tra token workflow app và replay 2 escalation ticket đang nằm ở dead-letter.",
    note:
      "Connector này là destination ưu tiên cho escalation và approval workflow.",
    sourceSystems: ["Escalation routing", "Assignment", "Approval"],
    recentRuns: [
      {
        id: "run-lark-1",
        label: "Escalation push",
        statusLabel: "Lỗi",
        duration: "15 giây",
        startedAt: "20:43",
        note: "Token app hết hạn, MIABOS đã fallback sang internal queue.",
      },
      {
        id: "run-lark-2",
        label: "Retry internal queue",
        statusLabel: "Pending",
        duration: "-",
        startedAt: "20:45",
        note: "Đang chờ replay sau khi refresh token.",
      },
    ],
  },
];

export const MAPPING_CONFLICT_RECORDS: MappingConflictRecord[] = [
  {
    id: "MAP-PRD-038",
    entityType: "Product",
    canonicalKey: "PRD-VELO-39-BLK",
    domain: "inventory",
    statusLabel: "Chờ đánh giá",
    statusGroup: "attention",
    warningState: "attention",
    owner: "Data Steward",
    updatedAt: "16/04 • 19:12",
    conflictReason:
      "SAP B1 và KiotViet đang dùng hai SKU khác nhau cho cùng một biến thể Sneaker Velocity size 39 màu đen.",
    nextAction:
      "Chốt SKU chuẩn cho variant và replay lại projection tồn ở cửa hàng trước 09:00 ngày mai.",
    activeRule:
      "Ưu tiên barcode match, fallback sang tên + size + màu khi source thiếu SKU chuẩn.",
    reviewNote:
      "Đây là conflict ảnh hưởng trực tiếp đến inventory availability và order hold.",
    sourceValues: [
      {
        id: "map-prd-1",
        system: "SAP B1",
        label: "Item code",
        value: "SV-39-BLK",
        syncedAt: "21:10",
      },
      {
        id: "map-prd-2",
        system: "KiotViet",
        label: "Variant SKU",
        value: "SVELOCITY-39-B",
        syncedAt: "21:57",
      },
      {
        id: "map-prd-3",
        system: "Haravan",
        label: "Product variant",
        value: "SV-39-BLK",
        syncedAt: "21:48",
      },
    ],
  },
  {
    id: "MAP-ORD-011",
    entityType: "Order",
    canonicalKey: "ORD-2026-004821",
    domain: "customer",
    statusLabel: "Đang áp dụng quy tắc tạm",
    statusGroup: "attention",
    warningState: "restricted",
    owner: "Ops Governance",
    updatedAt: "16/04 • 17:44",
    conflictReason:
      "Đơn đổi trả có cả `channel_order_no` trên Haravan và `invoice_id` POS, nhưng chưa thống nhất canonical order ref.",
    nextAction:
      "Giữ rule tạm theo source priority của order summary và chờ chốt dual-ID policy cho return.",
    activeRule:
      "Order online giữ `channel_order_no` làm primary, POS invoice lưu reference phụ.",
    reviewNote:
      "Case này ảnh hưởng trực tiếp đến M05 Order Summary và CSKH khi tra theo số điện thoại.",
    sourceValues: [
      {
        id: "map-ord-1",
        system: "Haravan",
        label: "Channel order",
        value: "HAR-984302",
        syncedAt: "20:58",
      },
      {
        id: "map-ord-2",
        system: "KiotViet",
        label: "Invoice",
        value: "KV-INV-55481",
        syncedAt: "21:05",
      },
      {
        id: "map-ord-3",
        system: "MIABOS",
        label: "Canonical ref",
        value: "ORD-2026-004821",
        syncedAt: "21:06",
      },
    ],
  },
  {
    id: "MAP-LOC-004",
    entityType: "Location",
    canonicalKey: "BR-TPHCM-FLAGSHIP-Q1",
    domain: "access",
    statusLabel: "Đã chốt",
    statusGroup: "resolved",
    warningState: "none",
    owner: "Retail Ops",
    updatedAt: "16/04 • 14:40",
    conflictReason:
      "Tên chi nhánh giữa SAP B1, KiotViet và Haravan từng khác nhau nên rule scope theo branch bị lệch.",
    nextAction:
      "Dùng làm mẫu chuẩn cho artifact M13 khi materialize branch/channel projection.",
    activeRule:
      "Branch code chuẩn hóa theo `BR-TPHCM-FLAGSHIP-Q1` cho mọi module downstream.",
    reviewNote:
      "Case đã resolve nhưng vẫn giữ để training cho đội vận hành hệ thống.",
    sourceValues: [
      {
        id: "map-loc-1",
        system: "SAP B1",
        label: "Warehouse / branch",
        value: "Flagship Q1",
        syncedAt: "18:10",
      },
      {
        id: "map-loc-2",
        system: "KiotViet",
        label: "Branch name",
        value: "BQ Q1",
        syncedAt: "18:55",
      },
      {
        id: "map-loc-3",
        system: "Haravan",
        label: "Pickup location",
        value: "Flagship District 1",
        syncedAt: "19:02",
      },
    ],
  },
  {
    id: "MAP-CUS-021",
    entityType: "Customer",
    canonicalKey: "CUS-0908123456",
    domain: "customer",
    statusLabel: "Chờ đánh giá",
    statusGroup: "attention",
    warningState: "blocked",
    owner: "CRM Data",
    updatedAt: "16/04 • 13:24",
    conflictReason:
      "Hai hồ sơ loyalty chia sẻ cùng số điện thoại, nhưng lịch sử mua và tier đang khác nhau giữa CRM và Haravan.",
    nextAction:
      "Khóa answer loyalty và merge canonical customer sau khi xác nhận lịch sử mua với CSKH.",
    activeRule:
      "Phone number chỉ là weak match; loyalty tier chỉ được mở khi canonical profile đã approved.",
    reviewNote:
      "Conflict này là lý do tạo escalation `ESC-240416-003` ở M11.",
    sourceValues: [
      {
        id: "map-cus-1",
        system: "Haravan",
        label: "Customer profile",
        value: "Gold tier / 2.800 điểm",
        syncedAt: "21:48",
      },
      {
        id: "map-cus-2",
        system: "CRM",
        label: "Customer 360",
        value: "Silver tier / 1.200 điểm",
        syncedAt: "20:31",
      },
      {
        id: "map-cus-3",
        system: "MIABOS",
        label: "Canonical state",
        value: "Needs review",
        syncedAt: "20:33",
      },
    ],
  },
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function matchesQuery(query: string, values: string[]) {
  const keyword = normalize(query);
  if (keyword.length === 0) {
    return true;
  }

  return values.some((value) => normalize(value).includes(keyword));
}

function matchesStatus(
  statusGroup: Exclude<OperationsFilterStatus, "all">,
  status: OperationsFilterStatus,
) {
  return status === "all" || statusGroup === status;
}

function matchesDomain(
  value: Exclude<OperationsDomain, "all">,
  domain: OperationsDomain,
) {
  return domain === "all" || value === domain;
}

export function searchEscalations(filters: OperationsFilters) {
  return ESCALATION_RECORDS.filter((record) => {
    return (
      matchesStatus(record.statusGroup, filters.status) &&
      matchesDomain(record.domain, filters.domain) &&
      matchesQuery(filters.query, [
        record.id,
        record.subject,
        record.assignee,
        record.actor,
        record.sourceModule,
        record.destinationLabel,
        record.blockedReason,
        ...record.tags,
      ])
    );
  });
}

export function searchUserScopeProfiles(filters: OperationsFilters) {
  return USER_SCOPE_PROFILES.filter((record) => {
    const domainMatch =
      filters.domain === "all" || filters.domain === "access";

    return (
      domainMatch &&
      matchesStatus(record.statusGroup, filters.status) &&
      matchesQuery(filters.query, [
        record.name,
        record.role,
        record.ownerTeam,
        record.branchSummary,
        record.note,
        record.reviewNote,
        ...record.modes,
        ...record.scopeAssignments.flatMap((item) => item.values),
      ])
    );
  });
}

export function searchGovernanceRules(filters: OperationsFilters) {
  return GOVERNANCE_RULES.filter((record) => {
    return (
      matchesStatus(record.statusGroup, filters.status) &&
      matchesDomain(record.domain, filters.domain) &&
      matchesQuery(filters.query, [
        record.title,
        record.categoryLabel,
        record.roleLabel,
        record.modeLabel,
        record.owner,
        record.note,
        record.previewAfter,
        ...record.affectedAreas,
        ...record.hiddenFields,
      ])
    );
  });
}

export function searchConnectorHealth(filters: OperationsFilters) {
  return CONNECTOR_HEALTH_RECORDS.filter((record) => {
    const domainMatch =
      filters.domain === "all" || filters.domain === "integration";

    return (
      domainMatch &&
      matchesStatus(record.statusGroup, filters.status) &&
      matchesQuery(filters.query, [
        record.name,
        record.owner,
        record.note,
        record.nextAction,
        ...record.sourceSystems,
        ...record.recentRuns.flatMap((run) => [run.label, run.note]),
      ])
    );
  });
}

export function searchMappingConflicts(filters: OperationsFilters) {
  return MAPPING_CONFLICT_RECORDS.filter((record) => {
    return (
      matchesStatus(record.statusGroup, filters.status) &&
      matchesDomain(record.domain, filters.domain) &&
      matchesQuery(filters.query, [
        record.id,
        record.entityType,
        record.canonicalKey,
        record.conflictReason,
        record.owner,
        record.activeRule,
        record.reviewNote,
        ...record.sourceValues.flatMap((item) => [
          item.system,
          item.label,
          item.value,
        ]),
      ])
    );
  });
}

export function getEscalationById(id: string | null) {
  return ESCALATION_RECORDS.find((record) => record.id === id) ?? null;
}

export function getUserScopeProfileById(id: string | null) {
  return USER_SCOPE_PROFILES.find((record) => record.id === id) ?? null;
}

export function getGovernanceRuleById(id: string | null) {
  return GOVERNANCE_RULES.find((record) => record.id === id) ?? null;
}

export function getConnectorHealthById(id: string | null) {
  return CONNECTOR_HEALTH_RECORDS.find((record) => record.id === id) ?? null;
}

export function getMappingConflictById(id: string | null) {
  return MAPPING_CONFLICT_RECORDS.find((record) => record.id === id) ?? null;
}

export function getOperationsOverviewMetrics(
  filters: OperationsFilters,
): OperationsOverviewMetric[] {
  const escalations = searchEscalations(filters);
  const profiles = searchUserScopeProfiles(filters);
  const connectors = searchConnectorHealth(filters);
  const mappings = searchMappingConflicts(filters);

  const healthyConnectors = connectors.filter(
    (item) => item.statusLabel === "Ổn định",
  ).length;

  return [
    {
      id: "metric-escalations",
      label: "Escalation đang mở",
      value: `${escalations.filter((item) => item.statusGroup !== "resolved").length}`,
      tone: escalations.some((item) => item.statusGroup === "attention")
        ? "warning"
        : "default",
    },
    {
      id: "metric-access",
      label: "Hồ sơ quyền cần rà soát",
      value: `${profiles.filter((item) => item.warningState !== "none").length}`,
      tone: profiles.some((item) => item.warningState === "restricted")
        ? "warning"
        : "default",
    },
    {
      id: "metric-connectors",
      label: "Kết nối ổn định",
      value: `${healthyConnectors}/${connectors.length || 0}`,
      tone: healthyConnectors === connectors.length ? "success" : "warning",
    },
    {
      id: "metric-mapping",
      label: "Conflict mapping mở",
      value: `${mappings.filter((item) => item.statusGroup !== "resolved").length}`,
      tone: mappings.some((item) => item.warningState === "blocked")
        ? "danger"
        : "warning",
    },
  ];
}

export function getOperationsPageSummary(
  pathname: string,
  filters: OperationsFilters,
): OperationsPageSummary {
  if (pathname.startsWith("/operations/escalations")) {
    const records = searchEscalations(filters);
    return {
      title: "Escalation Queue",
      description:
        filters.query.trim().length === 0
          ? "Theo dõi các trường hợp AI hoặc người dùng cần chuyển tiếp sang người xử lý."
          : `Đang hiển thị ${records.length} escalation khớp với truy vấn hiện tại.`,
      count: records.length,
      countLabel: "ticket",
      badges: ["Theo dõi SLA", "Ưu tiên domain", "Có fallback queue"],
    };
  }

  if (pathname.startsWith("/operations/users-roles")) {
    const records = searchUserScopeProfiles(filters);
    return {
      title: "Users And Roles",
      description:
        filters.query.trim().length === 0
          ? "Quản trị người dùng, vai trò và phạm vi truy cập theo kênh, chi nhánh, loại cửa hàng."
          : `Đang hiển thị ${records.length} hồ sơ quyền phù hợp với bộ lọc hiện tại.`,
      count: records.length,
      countLabel: "hồ sơ quyền",
      badges: ["Role matrix", "Branch scope", "Mode nội bộ"],
    };
  }

  if (pathname.startsWith("/operations/scope-rules")) {
    const records = searchGovernanceRules(filters);
    return {
      title: "Scope And Sensitivity Rules",
      description:
        filters.query.trim().length === 0
          ? "Thiết lập các rule kiểm soát phạm vi hiển thị, độ nhạy dữ liệu và public-safe policy."
          : `Đang hiển thị ${records.length} rule phù hợp với truy vấn và domain đang chọn.`,
      count: records.length,
      countLabel: "rule",
      badges: ["Preview answer", "Mask field", "Public-safe"],
    };
  }

  if (pathname.startsWith("/operations/integration-ops")) {
    const records = searchConnectorHealth(filters);
    return {
      title: "Integration Ops",
      description:
        filters.query.trim().length === 0
          ? "Theo dõi tình trạng kết nối, retry queue, webhook backlog và dead-letter của các connector."
          : `Đang hiển thị ${records.length} connector hoặc run log phù hợp với bộ lọc.`,
      count: records.length,
      countLabel: "connector",
      badges: ["Retry queue", "Dead-letter", "Connector health"],
    };
  }

  const records = searchMappingConflicts(filters);
  return {
    title: "Source Of Truth And Mapping",
    description:
      filters.query.trim().length === 0
        ? "Đối soát mapping đa nguồn và kiểm soát rule ưu tiên nguồn cho product, customer, order, location."
        : `Đang hiển thị ${records.length} conflict hoặc rule mapping phù hợp với truy vấn.`,
    count: records.length,
    countLabel: "conflict",
    badges: ["Canonical key", "Priority rule", "Needs review"],
  };
}
