export type CustomerStatus = "Lead" | "Qualified" | "Customer" | "Inactive" | "Blocked";

export interface CustomerAttribute {
  key: string;
  label: string;
  value: string;
}

export interface OrderSummary {
  id: string;
  date: string;
  channel: string;
  total: number;
  status: string;
}

export interface ConversationSummary {
  id: string;
  channel: "Facebook" | "Zalo" | "Website" | "Internal";
  date: string;
  intent: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  summary: string;
  resolved: boolean;
}

export interface CallSummary {
  id: string;
  date: string;
  duration: string;
  direction: "Inbound" | "Outbound";
  outcome: "Answered" | "Missed" | "Voicemail" | "Callback";
  note: string;
  agent: string;
}

export interface IdentityMapping {
  system: string;
  externalId: string;
  status: "Linked" | "Suggested" | "Conflict";
  lastSynced: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: "order" | "chat" | "call" | "note" | "campaign" | "system";
  title: string;
  description: string;
  channel?: string;
}

export interface AISummaryData {
  summary: string;
  needs: string[];
  risks: string[];
  nextBestActions: string[];
  lastUpdated: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: CustomerStatus;
  source: string;
  consentGiven: boolean;
  createdAt: string;
  lastContact: string;
  attributes: CustomerAttribute[];
  orders: OrderSummary[];
  tags: string[];
  avatarUrl?: string;
  // Customer 360 fields
  gender?: string;
  birthday?: string;
  region?: string;
  preferredChannel?: string;
  preferredStore?: string;
  conversations: ConversationSummary[];
  calls: CallSummary[];
  identities: IdentityMapping[];
  timeline: TimelineEvent[];
  aiSummary?: AISummaryData;
  totalSpent?: number;
  orderCount?: number;
  avgOrderValue?: number;
  // List view fields
  channel?: string;
  platform?: string;
  syncSource?: string;
  assignee?: string;
  updatedAt?: string;
}

export const CUSTOMERS: Customer[] = [
  {
    id: "CRM-001",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM001&backgroundColor=b6e3f4",
    name: "Nguyễn Văn An",
    phone: "0901 234 567",
    email: "an.nguyen@gmail.com",
    status: "Customer",
    source: "Haravan",
    consentGiven: true,
    createdAt: "2025-11-10",
    lastContact: "2026-04-14",
    gender: "Nam",
    birthday: "1990-05-15",
    region: "TP.HCM",
    preferredChannel: "Zalo",
    preferredStore: "BQ Tân Bình",
    totalSpent: 4_240_000,
    orderCount: 3,
    avgOrderValue: 1_413_333,
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "42" },
      { key: "preferred_style", label: "Phong cách", value: "Thể thao" },
      { key: "branch_preference", label: "Chi nhánh", value: "BQ Tân Bình" },
      { key: "budget_range", label: "Ngân sách", value: "1-3 triệu" },
      { key: "purpose", label: "Mục đích", value: "Chạy bộ, đi làm" },
    ],
    orders: [
      { id: "ORD-1001", date: "2026-04-10", channel: "Online", total: 1_250_000, status: "Delivered" },
      { id: "ORD-0892", date: "2026-03-15", channel: "POS", total: 890_000, status: "Delivered" },
      { id: "ORD-0754", date: "2026-01-20", channel: "Online", total: 2_100_000, status: "Delivered" },
    ],
    conversations: [
      {
        id: "CONV-001",
        channel: "Zalo",
        date: "2026-04-14",
        intent: "Hỏi về giày chạy bộ mới",
        sentiment: "Positive",
        summary: "Khách hỏi về mẫu giày chạy bộ Nike mới. Đã tư vấn 3 mẫu phù hợp size 42. Khách quan tâm mẫu Air Zoom.",
        resolved: true,
      },
      {
        id: "CONV-002",
        channel: "Facebook",
        date: "2026-03-20",
        intent: "Hỏi tình trạng đơn hàng",
        sentiment: "Neutral",
        summary: "Khách hỏi về đơn ORD-0892 đã giao chưa. Đã xác nhận đơn đang vận chuyển.",
        resolved: true,
      },
      {
        id: "CONV-003",
        channel: "Website",
        date: "2026-01-18",
        intent: "Tư vấn size giày",
        sentiment: "Positive",
        summary: "Khách cần tư vấn size giày thể thao. Đã xác nhận size 42 phù hợp dựa trên chiều dài bàn chân 26.5cm.",
        resolved: true,
      },
    ],
    calls: [
      {
        id: "CALL-001",
        date: "2026-04-12",
        duration: "3:45",
        direction: "Outbound",
        outcome: "Answered",
        note: "Gọi xác nhận đơn ORD-1001 đã nhận. Khách hài lòng, muốn xem thêm mẫu mới.",
        agent: "Nguyễn Thị Hoa",
      },
      {
        id: "CALL-002",
        date: "2026-02-10",
        duration: "5:20",
        direction: "Inbound",
        outcome: "Answered",
        note: "Khách gọi hỏi chính sách đổi trả. Đã giải thích đổi trong 30 ngày. Khách đồng ý.",
        agent: "Trần Văn Bình",
      },
    ],
    identities: [
      { system: "Haravan", externalId: "HAR-CUS-78234", status: "Linked", lastSynced: "2026-04-14" },
      { system: "KiotViet", externalId: "KV-98201", status: "Linked", lastSynced: "2026-04-14" },
      { system: "SAP B1", externalId: "BP-10045", status: "Linked", lastSynced: "2026-04-13" },
      { system: "Zalo OA", externalId: "ZALO-USR-4412", status: "Linked", lastSynced: "2026-04-14" },
      { system: "Facebook", externalId: "FB-PSID-887234", status: "Suggested", lastSynced: "2026-03-20" },
    ],
    timeline: [
      { id: "TL-001", date: "2026-04-14", type: "chat", title: "Chat Zalo — Hỏi giày chạy bộ", description: "Tư vấn 3 mẫu giày chạy bộ Nike size 42", channel: "Zalo" },
      { id: "TL-002", date: "2026-04-12", type: "call", title: "Gọi xác nhận đơn hàng", description: "Xác nhận ORD-1001 đã nhận, khách hài lòng", channel: "OmiCall" },
      { id: "TL-003", date: "2026-04-10", type: "order", title: "Đơn hàng ORD-1001", description: "Mua giày Nike Air Max — 1,250,000đ — Online", channel: "Haravan" },
      { id: "TL-004", date: "2026-03-20", type: "chat", title: "Chat Facebook — Hỏi đơn hàng", description: "Hỏi tình trạng đơn ORD-0892", channel: "Facebook" },
      { id: "TL-005", date: "2026-03-15", type: "order", title: "Đơn hàng ORD-0892", description: "Mua giày thể thao — 890,000đ — POS BQ Tân Bình", channel: "KiotViet" },
      { id: "TL-006", date: "2026-02-10", type: "call", title: "Gọi đến — Hỏi đổi trả", description: "Khách hỏi chính sách đổi trả, đã giải thích", channel: "OmiCall" },
      { id: "TL-007", date: "2026-01-20", type: "order", title: "Đơn hàng ORD-0754", description: "Mua giày chạy bộ — 2,100,000đ — Online", channel: "Haravan" },
      { id: "TL-008", date: "2026-01-18", type: "chat", title: "Chat Website — Tư vấn size", description: "Xác nhận size 42 phù hợp", channel: "Website" },
      { id: "TL-009", date: "2025-12-25", type: "campaign", title: "Gửi CTKM Giáng sinh", description: "Voucher 15% cho khách VIP — Đã mở email", channel: "Email" },
      { id: "TL-010", date: "2025-11-10", type: "system", title: "Tạo hồ sơ CRM", description: "Hồ sơ được tạo từ đồng bộ Haravan", channel: "System" },
    ],
    aiSummary: {
      summary: "Khách hàng nam, 36 tuổi, TP.HCM. Mua giày thể thao/chạy bộ là chính, size 42. Tần suất mua ~1 lần/tháng, giá trị TB 1.4 triệu. Kênh ưu tiên: Zalo. Khách VIP, hài lòng dịch vụ.",
      needs: ["Giày chạy bộ mới (đã hỏi qua Zalo)", "Có thể cần giày đi làm phong cách sport-casual"],
      risks: ["Không có rủi ro hiện tại", "Consent OK, tương tác đều đặn"],
      nextBestActions: ["Gửi thông tin mẫu Nike Air Zoom mới — khách đã quan tâm", "Mời tham gia chương trình Loyalty VIP tier 2", "Gợi ý giày sport-casual cho nhu cầu đi làm"],
      lastUpdated: "2026-04-14",
    },
    tags: ["VIP", "Thể thao"],
    channel: "Online",
    platform: "Zalo",
    syncSource: "Haravan",
    assignee: "Nguyễn Thị Hoa",
    updatedAt: "2026-04-14",
  },
  {
    id: "CRM-002",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM002&backgroundColor=ffd5dc",
    name: "Trần Thị Bích",
    phone: "0912 345 678",
    email: "bich.tran@yahoo.com",
    status: "Qualified",
    source: "KiotViet",
    consentGiven: true,
    createdAt: "2026-02-05",
    lastContact: "2026-04-12",
    gender: "Nữ",
    region: "TP.HCM",
    preferredStore: "BQ Quận 1",
    totalSpent: 1_750_000,
    orderCount: 1,
    avgOrderValue: 1_750_000,
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "37" },
      { key: "preferred_style", label: "Phong cách", value: "Công sở" },
    ],
    orders: [
      { id: "ORD-0980", date: "2026-04-01", channel: "POS", total: 1_750_000, status: "Delivered" },
    ],
    conversations: [
      {
        id: "CONV-004",
        channel: "Zalo",
        date: "2026-04-12",
        intent: "Hỏi giày công sở nữ",
        sentiment: "Positive",
        summary: "Khách hỏi về giày cao gót công sở, size 37. Đã gửi 5 mẫu phù hợp.",
        resolved: true,
      },
    ],
    calls: [],
    identities: [
      { system: "KiotViet", externalId: "KV-10432", status: "Linked", lastSynced: "2026-04-12" },
    ],
    timeline: [
      { id: "TL-020", date: "2026-04-12", type: "chat", title: "Chat Zalo — Hỏi giày công sở", description: "Tư vấn 5 mẫu giày cao gót size 37", channel: "Zalo" },
      { id: "TL-021", date: "2026-04-01", type: "order", title: "Đơn hàng ORD-0980", description: "Mua giày công sở — 1,750,000đ — POS", channel: "KiotViet" },
      { id: "TL-022", date: "2026-02-05", type: "system", title: "Tạo hồ sơ CRM", description: "Hồ sơ từ KiotViet", channel: "System" },
    ],
    aiSummary: {
      summary: "Khách nữ, TP.HCM. Mua 1 đôi giày công sở, size 37. Đang qualified — cần kích hoạt mua lần 2.",
      needs: ["Giày công sở nữ thêm mẫu", "Có thể cần giày đi chơi"],
      risks: ["Mới mua 1 lần, cần chăm sóc để giữ chân"],
      nextBestActions: ["Gửi ưu đãi mua lần 2 — giảm 10%", "Tư vấn thêm mẫu giày công sở mới về"],
      lastUpdated: "2026-04-12",
    },
    tags: ["Công sở"],
    channel: "POS",
    platform: "KiotViet",
    syncSource: "KiotViet",
    assignee: "Trần Văn Bình",
    updatedAt: "2026-04-12",
  },
  {
    id: "CRM-003",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM003&backgroundColor=c0aede",
    name: "Lê Hoàng Minh",
    phone: "0938 456 789",
    email: "minh.le@outlook.com",
    status: "Lead",
    source: "Facebook",
    consentGiven: false,
    createdAt: "2026-04-13",
    lastContact: "2026-04-13",
    gender: "Nam",
    region: "Hà Nội",
    attributes: [],
    orders: [],
    conversations: [
      {
        id: "CONV-005",
        channel: "Facebook",
        date: "2026-04-13",
        intent: "Hỏi giá giày",
        sentiment: "Neutral",
        summary: "Khách hỏi giá giày da nam trên Facebook. Chưa để lại consent cho remarketing.",
        resolved: false,
      },
    ],
    calls: [],
    identities: [
      { system: "Facebook", externalId: "FB-PSID-991100", status: "Linked", lastSynced: "2026-04-13" },
    ],
    timeline: [
      { id: "TL-030", date: "2026-04-13", type: "chat", title: "Chat Facebook — Hỏi giá", description: "Lead mới từ Facebook, hỏi giá giày da nam", channel: "Facebook" },
      { id: "TL-031", date: "2026-04-13", type: "system", title: "Tạo hồ sơ Lead", description: "Lead từ Facebook Messenger", channel: "System" },
    ],
    tags: [],
    channel: "Social",
    platform: "Facebook",
    syncSource: "MIA BOS",
    assignee: "—",
    updatedAt: "2026-04-13",
  },
  {
    id: "CRM-004",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM004&backgroundColor=ffdfbf",
    name: "Phạm Thùy Dung",
    phone: "0976 567 890",
    email: "dung.pham@gmail.com",
    status: "Customer",
    source: "Zalo",
    consentGiven: true,
    createdAt: "2025-08-22",
    lastContact: "2026-04-10",
    gender: "Nữ",
    birthday: "1995-09-12",
    region: "TP.HCM",
    preferredChannel: "Zalo",
    preferredStore: "BQ Quận 7",
    totalSpent: 2_050_000,
    orderCount: 2,
    avgOrderValue: 1_025_000,
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "38" },
      { key: "preferred_style", label: "Phong cách", value: "Sandal" },
      { key: "branch_preference", label: "Chi nhánh", value: "BQ Quận 7" },
    ],
    orders: [
      { id: "ORD-1050", date: "2026-04-09", channel: "Online", total: 650_000, status: "Delivered" },
      { id: "ORD-0800", date: "2026-02-14", channel: "POS", total: 1_400_000, status: "Delivered" },
    ],
    conversations: [
      {
        id: "CONV-006",
        channel: "Zalo",
        date: "2026-04-10",
        intent: "Hỏi về sandal mùa hè",
        sentiment: "Positive",
        summary: "Khách hỏi sandal mùa hè, thích style thoải mái. Đã tư vấn 3 mẫu.",
        resolved: true,
      },
      {
        id: "CONV-007",
        channel: "Zalo",
        date: "2026-02-12",
        intent: "Hỏi voucher Valentine",
        sentiment: "Positive",
        summary: "Khách hỏi CTKM Valentine, đã gửi mã giảm 20%.",
        resolved: true,
      },
    ],
    calls: [
      {
        id: "CALL-003",
        date: "2026-03-15",
        duration: "2:10",
        direction: "Outbound",
        outcome: "Answered",
        note: "Gọi chăm sóc sau mua. Khách hài lòng với sandal, muốn xem thêm mẫu hè.",
        agent: "Nguyễn Thị Hoa",
      },
    ],
    identities: [
      { system: "Haravan", externalId: "HAR-CUS-85110", status: "Linked", lastSynced: "2026-04-10" },
      { system: "Zalo OA", externalId: "ZALO-USR-5523", status: "Linked", lastSynced: "2026-04-10" },
      { system: "KiotViet", externalId: "KV-22045", status: "Suggested", lastSynced: "2026-03-01" },
    ],
    timeline: [
      { id: "TL-040", date: "2026-04-10", type: "chat", title: "Chat Zalo — Sandal mùa hè", description: "Tư vấn 3 mẫu sandal thoải mái", channel: "Zalo" },
      { id: "TL-041", date: "2026-04-09", type: "order", title: "Đơn hàng ORD-1050", description: "Mua sandal — 650,000đ — Online", channel: "Haravan" },
      { id: "TL-042", date: "2026-03-15", type: "call", title: "Gọi chăm sóc sau mua", description: "Khách hài lòng, muốn xem thêm mẫu hè", channel: "OmiCall" },
      { id: "TL-043", date: "2026-02-14", type: "order", title: "Đơn hàng ORD-0800", description: "Mua sandal Valentine — 1,400,000đ — POS", channel: "KiotViet" },
      { id: "TL-044", date: "2026-02-12", type: "chat", title: "Chat Zalo — Voucher Valentine", description: "Gửi mã giảm 20%", channel: "Zalo" },
      { id: "TL-045", date: "2025-08-22", type: "system", title: "Tạo hồ sơ CRM", description: "Hồ sơ từ Zalo OA", channel: "System" },
    ],
    aiSummary: {
      summary: "Khách nữ, 30 tuổi, TP.HCM. Ưu thích sandal, size 38. Mua 2 lần, TB 1 triệu. Phản hồi tốt, kênh Zalo.",
      needs: ["Sandal mùa hè mới", "Có thể quan tâm giày đi biển"],
      risks: ["Giá trị đơn TB thấp — cần upsell"],
      nextBestActions: ["Gửi bộ sưu tập sandal hè mới qua Zalo", "Gợi ý combo sandal + phụ kiện để tăng giá trị đơn"],
      lastUpdated: "2026-04-10",
    },
    tags: ["Remarketing"],
    channel: "Online",
    platform: "Zalo",
    syncSource: "Haravan",
    assignee: "Nguyễn Thị Hoa",
    updatedAt: "2026-04-10",
  },
  {
    id: "CRM-005",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM005&backgroundColor=d1d4f9",
    name: "Võ Quốc Hùng",
    phone: "0965 678 901",
    email: "",
    status: "Inactive",
    source: "SAP B1",
    consentGiven: true,
    createdAt: "2024-12-01",
    lastContact: "2025-06-15",
    gender: "Nam",
    region: "Đà Nẵng",
    totalSpent: 980_000,
    orderCount: 1,
    avgOrderValue: 980_000,
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "43" },
    ],
    orders: [
      { id: "ORD-0320", date: "2025-06-10", channel: "POS", total: 980_000, status: "Delivered" },
    ],
    conversations: [],
    calls: [
      {
        id: "CALL-004",
        date: "2025-06-15",
        duration: "1:30",
        direction: "Outbound",
        outcome: "Answered",
        note: "Gọi xác nhận đơn. Khách OK, không có yêu cầu thêm.",
        agent: "Lê Minh Tâm",
      },
      {
        id: "CALL-005",
        date: "2025-10-01",
        duration: "0:00",
        direction: "Outbound",
        outcome: "Missed",
        note: "Gọi win-back, không nghe máy.",
        agent: "Nguyễn Thị Hoa",
      },
    ],
    identities: [
      { system: "SAP B1", externalId: "BP-10089", status: "Linked", lastSynced: "2026-01-15" },
      { system: "KiotViet", externalId: "KV-44012", status: "Linked", lastSynced: "2025-06-10" },
    ],
    timeline: [
      { id: "TL-050", date: "2025-10-01", type: "call", title: "Gọi win-back — Missed", description: "Không nghe máy", channel: "OmiCall" },
      { id: "TL-051", date: "2025-06-15", type: "call", title: "Gọi xác nhận đơn", description: "Khách OK", channel: "OmiCall" },
      { id: "TL-052", date: "2025-06-10", type: "order", title: "Đơn hàng ORD-0320", description: "Mua giày — 980,000đ — POS", channel: "KiotViet" },
      { id: "TL-053", date: "2024-12-01", type: "system", title: "Tạo hồ sơ CRM", description: "Đồng bộ từ SAP B1", channel: "System" },
    ],
    aiSummary: {
      summary: "Khách nam, Đà Nẵng. Mua 1 lần cách đây 10 tháng, không tương tác lại. Cần win-back.",
      needs: ["Không rõ nhu cầu hiện tại"],
      risks: ["Inactive >10 tháng", "Gọi win-back không nghe máy"],
      nextBestActions: ["Gửi SMS/Zalo CTKM win-back", "Thử gọi lại vào giờ khác"],
      lastUpdated: "2026-04-01",
    },
    tags: [],
    channel: "POS",
    platform: "KiotViet",
    syncSource: "SAP B1",
    assignee: "Lê Minh Tâm",
    updatedAt: "2025-10-01",
  },
  {
    id: "CRM-006",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM006&backgroundColor=b6e3f4",
    name: "Đặng Minh Tuấn",
    phone: "0987 789 012",
    email: "tuan.dang@company.vn",
    status: "Blocked",
    source: "Haravan",
    consentGiven: false,
    createdAt: "2025-05-10",
    lastContact: "2025-09-20",
    attributes: [],
    orders: [],
    conversations: [
      {
        id: "CONV-008",
        channel: "Facebook",
        date: "2025-09-20",
        intent: "Khiếu nại gian lận",
        sentiment: "Negative",
        summary: "Khách bị phát hiện sử dụng nhiều tài khoản để trục lợi voucher. Đã block.",
        resolved: true,
      },
    ],
    calls: [],
    identities: [
      { system: "Haravan", externalId: "HAR-CUS-33201", status: "Linked", lastSynced: "2025-09-20" },
    ],
    timeline: [
      { id: "TL-060", date: "2025-09-20", type: "note", title: "Block tài khoản", description: "Phát hiện gian lận voucher, block account", channel: "Internal" },
      { id: "TL-061", date: "2025-05-10", type: "system", title: "Tạo hồ sơ CRM", description: "Đồng bộ từ Haravan", channel: "System" },
    ],
    tags: ["Fraud suspect"],
    channel: "Online",
    platform: "Haravan",
    syncSource: "Haravan",
    assignee: "—",
    updatedAt: "2025-09-20",
  },
  {
    id: "CRM-007",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM007&backgroundColor=ffd5dc",
    name: "Huỳnh Ngọc Lan",
    phone: "0923 890 123",
    email: "lan.huynh@gmail.com",
    status: "Lead",
    source: "Website",
    consentGiven: true,
    createdAt: "2026-04-15",
    lastContact: "2026-04-15",
    gender: "Nữ",
    region: "TP.HCM",
    attributes: [
      { key: "preferred_style", label: "Phong cách", value: "Cao gót" },
    ],
    orders: [],
    conversations: [
      {
        id: "CONV-009",
        channel: "Website",
        date: "2026-04-15",
        intent: "Tìm giày cao gót",
        sentiment: "Positive",
        summary: "Lead mới từ website chatbot. Hỏi về giày cao gót nữ, size 36. Đã tư vấn 2 mẫu.",
        resolved: false,
      },
    ],
    calls: [],
    identities: [
      { system: "Website", externalId: "WEB-VST-88123", status: "Linked", lastSynced: "2026-04-15" },
    ],
    timeline: [
      { id: "TL-070", date: "2026-04-15", type: "chat", title: "Chat Website — Giày cao gót", description: "Lead mới, hỏi giày cao gót size 36", channel: "Website" },
      { id: "TL-071", date: "2026-04-15", type: "system", title: "Tạo hồ sơ Lead", description: "Lead từ Website chatbot", channel: "System" },
    ],
    aiSummary: {
      summary: "Lead nữ mới từ website, TP.HCM. Quan tâm giày cao gót size 36. Có consent, cần follow-up nhanh.",
      needs: ["Giày cao gót nữ size 36"],
      risks: ["Lead mới — dễ mất nếu không follow-up trong 24h"],
      nextBestActions: ["Gọi tư vấn trong 24h", "Gửi catalog giày cao gót qua email/Zalo"],
      lastUpdated: "2026-04-15",
    },
    tags: [],
    channel: "Online",
    platform: "Website",
    syncSource: "MIA BOS",
    assignee: "Trần Văn Bình",
    updatedAt: "2026-04-15",
  },
  {
    id: "CRM-008",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM008&backgroundColor=c0aede",
    name: "Bùi Thanh Hải",
    phone: "0945 901 234",
    email: "hai.bui@gmail.com",
    status: "Customer",
    source: "KiotViet",
    consentGiven: true,
    createdAt: "2025-10-15",
    lastContact: "2026-04-11",
    gender: "Nam",
    birthday: "1985-03-22",
    region: "TP.HCM",
    preferredChannel: "Facebook",
    preferredStore: "BQ Quận 3",
    totalSpent: 5_000_000,
    orderCount: 2,
    avgOrderValue: 2_500_000,
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "41" },
      { key: "preferred_style", label: "Phong cách", value: "Da nam" },
      { key: "budget_range", label: "Ngân sách", value: "2-5 triệu" },
    ],
    orders: [
      { id: "ORD-1020", date: "2026-04-05", channel: "POS", total: 3_200_000, status: "Delivered" },
      { id: "ORD-0900", date: "2026-03-01", channel: "Online", total: 1_800_000, status: "Returned" },
    ],
    conversations: [
      {
        id: "CONV-010",
        channel: "Facebook",
        date: "2026-04-11",
        intent: "Hỏi giày da mới",
        sentiment: "Positive",
        summary: "Khách VIP hỏi về bộ sưu tập giày da mới. Đã gửi 4 mẫu cao cấp.",
        resolved: true,
      },
      {
        id: "CONV-011",
        channel: "Zalo",
        date: "2026-03-05",
        intent: "Yêu cầu đổi trả",
        sentiment: "Negative",
        summary: "Khách yêu cầu đổi trả ORD-0900 vì size không vừa. Đã hướng dẫn quy trình.",
        resolved: true,
      },
    ],
    calls: [
      {
        id: "CALL-006",
        date: "2026-04-08",
        duration: "4:15",
        direction: "Inbound",
        outcome: "Answered",
        note: "Khách gọi hỏi về giày da Oxford mới. Muốn đặt trước 1 đôi size 41.",
        agent: "Trần Văn Bình",
      },
      {
        id: "CALL-007",
        date: "2026-03-10",
        duration: "6:00",
        direction: "Outbound",
        outcome: "Answered",
        note: "Gọi xử lý đổi trả ORD-0900. Đã xác nhận đổi sang size 41. Khách hài lòng.",
        agent: "Nguyễn Thị Hoa",
      },
    ],
    identities: [
      { system: "KiotViet", externalId: "KV-30102", status: "Linked", lastSynced: "2026-04-11" },
      { system: "SAP B1", externalId: "BP-10078", status: "Linked", lastSynced: "2026-04-10" },
      { system: "Haravan", externalId: "HAR-CUS-90112", status: "Conflict", lastSynced: "2026-04-05" },
      { system: "Facebook", externalId: "FB-PSID-776543", status: "Linked", lastSynced: "2026-04-11" },
    ],
    timeline: [
      { id: "TL-080", date: "2026-04-11", type: "chat", title: "Chat Facebook — Giày da mới", description: "Tư vấn 4 mẫu giày da cao cấp", channel: "Facebook" },
      { id: "TL-081", date: "2026-04-08", type: "call", title: "Gọi đến — Hỏi Oxford", description: "Muốn đặt trước Oxford size 41", channel: "OmiCall" },
      { id: "TL-082", date: "2026-04-05", type: "order", title: "Đơn hàng ORD-1020", description: "Mua giày da — 3,200,000đ — POS", channel: "KiotViet" },
      { id: "TL-083", date: "2026-03-10", type: "call", title: "Gọi xử lý đổi trả", description: "Đổi ORD-0900 sang size 41, khách hài lòng", channel: "OmiCall" },
      { id: "TL-084", date: "2026-03-05", type: "chat", title: "Chat Zalo — Đổi trả", description: "Yêu cầu đổi trả ORD-0900", channel: "Zalo" },
      { id: "TL-085", date: "2026-03-01", type: "order", title: "Đơn hàng ORD-0900", description: "Mua giày da — 1,800,000đ — Online — Returned", channel: "Haravan" },
      { id: "TL-086", date: "2025-10-15", type: "system", title: "Tạo hồ sơ CRM", description: "Đồng bộ từ KiotViet", channel: "System" },
    ],
    aiSummary: {
      summary: "Khách VIP nam, 41 tuổi, TP.HCM. Phân khúc giày da cao cấp, size 41. Tổng chi 5 triệu, có 1 đơn trả. Cần chú ý tư vấn size chính xác.",
      needs: ["Giày da Oxford mới — đã muốn đặt trước", "Phong cách da nam cao cấp"],
      risks: ["Có 1 đơn trả (sai size) — cần tư vấn kỹ hơn", "Identity conflict với Haravan — cần review"],
      nextBestActions: ["Xác nhận đặt trước giày Oxford size 41", "Review identity conflict Haravan", "Gợi ý bảo hành/chăm sóc da giày"],
      lastUpdated: "2026-04-11",
    },
    tags: ["VIP", "Da nam"],
    channel: "POS",
    platform: "Facebook",
    syncSource: "KiotViet",
    assignee: "Nguyễn Thị Hoa",
    updatedAt: "2026-04-11",
  },
  // ── Duplicate test records ──
  {
    id: "CRM-009",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM009&backgroundColor=ffdfbf",
    name: "Nguyễn An",
    phone: "0901 234 567",
    email: "an.nguyen.work@gmail.com",
    status: "Lead" as const,
    source: "Facebook",
    consentGiven: false,
    createdAt: "2026-04-18",
    lastContact: "2026-04-18",
    attributes: [],
    orders: [],
    conversations: [],
    calls: [],
    identities: [{ system: "Facebook", externalId: "FB-PSID-999111", status: "Linked" as const, lastSynced: "2026-04-18" }],
    timeline: [{ id: "TL-090", date: "2026-04-18", type: "system" as const, title: "Tạo hồ sơ Lead", description: "Lead từ Facebook — SĐT trùng CRM-001", channel: "Facebook" }],
    tags: [],
    channel: "Social",
    platform: "Facebook",
    syncSource: "MIA BOS",
    assignee: "Trần Văn Bình",
    updatedAt: "2026-04-18",
  },
  {
    id: "CRM-010",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM010&backgroundColor=c0aede",
    name: "Phạm Dung",
    phone: "0976 567 890",
    email: "dung.pham@gmail.com",
    status: "Lead" as const,
    source: "Zalo",
    consentGiven: true,
    createdAt: "2026-04-17",
    lastContact: "2026-04-17",
    attributes: [{ key: "shoe_size", label: "Size giày", value: "38" }],
    orders: [],
    conversations: [],
    calls: [],
    identities: [{ system: "Zalo OA", externalId: "ZALO-USR-9988", status: "Linked" as const, lastSynced: "2026-04-17" }],
    timeline: [{ id: "TL-091", date: "2026-04-17", type: "system" as const, title: "Tạo hồ sơ Lead", description: "Lead từ Zalo — SĐT trùng CRM-004, Email trùng CRM-004", channel: "Zalo" }],
    tags: [],
    gender: "Nữ",
    region: "TP.HCM",
    channel: "Online",
    platform: "Zalo",
    syncSource: "MIA BOS",
    assignee: "Nguyễn Thị Hoa",
    updatedAt: "2026-04-17",
  },
  {
    id: "CRM-011",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=CRM011&backgroundColor=b6e3f4",
    name: "Bùi Hải",
    phone: "0945 901 234",
    email: "hai.bui@gmail.com",
    status: "Lead" as const,
    source: "Website",
    consentGiven: false,
    createdAt: "2026-04-16",
    lastContact: "2026-04-16",
    attributes: [],
    orders: [],
    conversations: [],
    calls: [],
    identities: [],
    timeline: [{ id: "TL-092", date: "2026-04-16", type: "system" as const, title: "Tạo hồ sơ Lead", description: "Lead từ Website — SĐT trùng CRM-008, Email trùng CRM-008", channel: "Website" }],
    tags: [],
    channel: "Online",
    platform: "Website",
    syncSource: "MIA BOS",
    updatedAt: "2026-04-16",
  },
];
