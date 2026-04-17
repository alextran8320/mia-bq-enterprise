export type Channel = "facebook" | "zalo" | "instagram" | "web";
export type ConversationStatus = "bot_active" | "agent_assigned" | "unassigned" | "resolved";
export type SenderType = "bot" | "agent" | "customer";
export type Stage = "potential" | "qualified" | "customer";
export type DeliveryStatus = "sending" | "sent" | "delivered" | "read" | "failed";
export type LeadClassification = "hot" | "warm" | "cold";

export interface Message {
  id: string;
  conversationId: string;
  senderType: SenderType;
  senderName: string;
  content: string;
  sentAt: string;
  deliveryStatus?: DeliveryStatus;
  isInternalNote?: boolean;
  botIntent?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  stage: Stage;
  tags: string[];
  channelHistory: { channel: Channel; lastContact: string }[];
  leadScore?: number;
  leadClassification?: LeadClassification;
}

export interface Conversation {
  id: string;
  customer: Customer;
  channel: Channel;
  status: ConversationStatus;
  botActive: boolean;
  assigneeId?: string;
  assigneeName?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  needsAttention?: boolean;
  attentionReason?: string;
}

// ── Customers ──────────────────────────────────────────────────────────────

const customers: Record<string, Customer> = {
  c1: {
    id: "c1",
    name: "Nguyễn Thị Lan",
    phone: "0901 234 567",
    email: "lan.nguyen@email.com",
    stage: "potential",
    tags: ["quan-tam-giay-the-thao", "khach-moi"],
    channelHistory: [{ channel: "zalo", lastContact: "8 phút trước" }],
    leadScore: 65,
    leadClassification: "hot",
  },
  c2: {
    id: "c2",
    name: "Trần Văn Minh",
    phone: "0912 345 678",
    stage: "potential",
    tags: ["hoi-gia"],
    channelHistory: [{ channel: "facebook", lastContact: "17 phút trước" }],
    leadScore: 30,
    leadClassification: "warm",
  },
  c3: {
    id: "c3",
    name: "Lê Hoàng Nam",
    phone: "0933 456 789",
    stage: "potential",
    tags: ["can-tu-van"],
    channelHistory: [{ channel: "zalo", lastContact: "1 giờ trước" }],
    leadScore: 15,
    leadClassification: "cold",
  },
  c4: {
    id: "c4",
    name: "Phạm Thu Hương",
    phone: "0944 567 890",
    email: "huong.pham@company.vn",
    stage: "qualified",
    tags: ["mua-so-luong", "doanh-nghiep"],
    channelHistory: [
      { channel: "facebook", lastContact: "3 giờ trước" },
      { channel: "web", lastContact: "1 ngày trước" },
    ],
    leadScore: 80,
    leadClassification: "hot",
  },
  c5: {
    id: "c5",
    name: "Võ Thanh Bình",
    phone: "0955 678 901",
    stage: "potential",
    tags: ["hoi-size"],
    channelHistory: [{ channel: "instagram", lastContact: "3 giờ trước" }],
    leadScore: 20,
    leadClassification: "cold",
  },
  c6: {
    id: "c6",
    name: "Đặng Minh Châu",
    phone: "0966 789 012",
    stage: "customer",
    tags: ["khach-cu", "vip"],
    channelHistory: [{ channel: "zalo", lastContact: "4 giờ trước" }],
    leadScore: 90,
    leadClassification: "hot",
  },
  c7: {
    id: "c7",
    name: "Bùi Thị Hoa",
    stage: "potential",
    tags: ["quan-tam-gia"],
    channelHistory: [{ channel: "web", lastContact: "5 giờ trước" }],
    leadScore: 25,
    leadClassification: "cold",
  },
};

// ── Conversations ───────────────────────────────────────────────────────────

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    customer: customers.c1!,
    channel: "zalo",
    status: "bot_active",
    botActive: true,
    lastMessage: "Mình cần tư vấn về giày thể thao ạ",
    lastMessageAt: "8 phút trước",
    unreadCount: 2,
    needsAttention: true,
    attentionReason: "Khách hàng tiềm năng cao",
  },
  {
    id: "conv-002",
    customer: customers.c2!,
    channel: "facebook",
    status: "bot_active",
    botActive: true,
    lastMessage: "Giá bao nhiêu vậy shop?",
    lastMessageAt: "17 phút trước",
    unreadCount: 1,
  },
  {
    id: "conv-003",
    customer: customers.c3!,
    channel: "zalo",
    status: "unassigned",
    botActive: false,
    lastMessage: "Mình cần người tư vấn trực tiếp",
    lastMessageAt: "1 giờ trước",
    unreadCount: 3,
    needsAttention: true,
    attentionReason: "Cần hỗ trợ",
  },
  {
    id: "conv-004",
    customer: customers.c4!,
    channel: "facebook",
    status: "agent_assigned",
    botActive: false,
    assigneeId: "agent-001",
    assigneeName: "Thu Hà",
    lastMessage: "Chị muốn đặt 20 đôi cho công ty",
    lastMessageAt: "3 giờ trước",
    unreadCount: 0,
  },
  {
    id: "conv-005",
    customer: customers.c5!,
    channel: "instagram",
    status: "bot_active",
    botActive: true,
    lastMessage: "Shop còn size 39 không ạ?",
    lastMessageAt: "3 giờ trước",
    unreadCount: 0,
  },
  {
    id: "conv-006",
    customer: customers.c6!,
    channel: "zalo",
    status: "agent_assigned",
    botActive: false,
    assigneeId: "agent-001",
    assigneeName: "Thu Hà",
    lastMessage: "Cho mình đổi sang màu đen được không?",
    lastMessageAt: "4 giờ trước",
    unreadCount: 1,
  },
  {
    id: "conv-007",
    customer: customers.c7!,
    channel: "web",
    status: "resolved",
    botActive: false,
    lastMessage: "Cảm ơn shop đã tư vấn!",
    lastMessageAt: "5 giờ trước",
    unreadCount: 0,
  },
];

// ── Messages per conversation ───────────────────────────────────────────────

export const MESSAGES: Record<string, Message[]> = {
  "conv-001": [
    {
      id: "m1",
      conversationId: "conv-001",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Chào bạn! Mình là Mia, tư vấn viên AI của Giày BQ. Bạn đang tìm gì hôm nay?",
      sentAt: "10 phút trước",
      botIntent: "greeting",
    },
    {
      id: "m2",
      conversationId: "conv-001",
      senderType: "customer",
      senderName: "Nguyễn Thị Lan",
      content: "Mình cần tư vấn về giày thể thao ạ",
      sentAt: "9 phút trước",
    },
    {
      id: "m3",
      conversationId: "conv-001",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Tuyệt! Bạn đang tìm giày thể thao cho mục đích gì? 😊",
      sentAt: "9 phút trước",
      botIntent: "qualification_need",
    },
    {
      id: "m4",
      conversationId: "conv-001",
      senderType: "customer",
      senderName: "Nguyễn Thị Lan",
      content: "Mình chạy bộ buổi sáng, khoảng 5km mỗi ngày",
      sentAt: "8 phút trước",
    },
    {
      id: "m5",
      conversationId: "conv-001",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Bạn cần giày gấp trong tuần này hay đang tham khảo thêm?",
      sentAt: "8 phút trước",
      botIntent: "qualification_timeline",
    },
  ],
  "conv-002": [
    {
      id: "m10",
      conversationId: "conv-002",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Chào bạn! Mình là Mia của Giày BQ. Mình có thể giúp gì cho bạn?",
      sentAt: "20 phút trước",
      botIntent: "greeting",
    },
    {
      id: "m11",
      conversationId: "conv-002",
      senderType: "customer",
      senderName: "Trần Văn Minh",
      content: "Giá bao nhiêu vậy shop?",
      sentAt: "17 phút trước",
    },
    {
      id: "m12",
      conversationId: "conv-002",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Giày BQ có nhiều dòng với mức giá từ 350.000đ đến 1.200.000đ tùy loại. Bạn đang quan tâm đến dòng giày nào — thể thao, công sở, hay dạo phố?",
      sentAt: "17 phút trước",
      botIntent: "pricing_inquiry",
    },
  ],
  "conv-003": [
    {
      id: "m20",
      conversationId: "conv-003",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Chào bạn! Mình là Mia của Giày BQ. Bạn cần tư vấn gì ạ?",
      sentAt: "1 giờ 10 phút trước",
      botIntent: "greeting",
    },
    {
      id: "m21",
      conversationId: "conv-003",
      senderType: "customer",
      senderName: "Lê Hoàng Nam",
      content: "Mình cần người tư vấn trực tiếp, bot không hiểu mình muốn gì",
      sentAt: "1 giờ trước",
    },
    {
      id: "m22",
      conversationId: "conv-003",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Được rồi! Mình sẽ kết nối bạn với tư vấn viên ngay. Vui lòng chờ mình một chút nhé! Tư vấn viên sẽ có mặt trong vài phút.",
      sentAt: "1 giờ trước",
      botIntent: "handoff",
    },
  ],
  "conv-004": [
    {
      id: "m30",
      conversationId: "conv-004",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Chào chị! Mình là Mia của Giày BQ. Chị cần tư vấn gì ạ?",
      sentAt: "4 giờ trước",
      botIntent: "greeting",
    },
    {
      id: "m31",
      conversationId: "conv-004",
      senderType: "customer",
      senderName: "Phạm Thu Hương",
      content: "Chị muốn mua số lượng lớn cho công ty, khoảng 20 đôi",
      sentAt: "3 giờ 30 phút trước",
    },
    {
      id: "m32",
      conversationId: "conv-004",
      senderType: "bot",
      senderName: "Bot AI",
      content: "Tuyệt! Với số lượng lớn, chị sẽ được ưu đãi đặc biệt. Mình đang kết nối chị với tư vấn viên chuyên về đơn hàng doanh nghiệp nhé!",
      sentAt: "3 giờ 20 phút trước",
      botIntent: "hot_lead_handoff",
    },
    {
      id: "m33",
      conversationId: "conv-004",
      senderType: "agent",
      senderName: "Thu Hà",
      content: "Chào chị Hương! Em là Thu Hà, tư vấn viên của BQ. Em sẽ hỗ trợ chị về đơn hàng doanh nghiệp. Chị muốn đặt dòng giày nào ạ?",
      sentAt: "3 giờ 15 phút trước",
      deliveryStatus: "read",
    },
    {
      id: "m34",
      conversationId: "conv-004",
      senderType: "customer",
      senderName: "Phạm Thu Hương",
      content: "Chị muốn đặt 20 đôi cho công ty, loại giày công sở nam, size 40-43",
      sentAt: "3 giờ trước",
    },
  ],
};

// ── Helpers ─────────────────────────────────────────────────────────────────

export function getChannelLabel(channel: Channel): string {
  const map: Record<Channel, string> = {
    facebook: "FB",
    zalo: "ZAL",
    instagram: "IG",
    web: "WEB",
  };
  return map[channel];
}

export function getChannelColor(channel: Channel): { bg: string; text: string } {
  const map: Record<Channel, { bg: string; text: string }> = {
    facebook: { bg: "rgba(24,119,242,0.12)", text: "#1877F2" },
    zalo: { bg: "rgba(0,104,255,0.12)", text: "#0068FF" },
    instagram: { bg: "rgba(225,48,108,0.12)", text: "#E1306C" },
    web: { bg: "var(--color-primary-light)", text: "var(--color-primary)" },
  };
  return map[channel];
}

export function getStageLabel(stage: Stage): string {
  const map: Record<Stage, string> = {
    potential: "Tiềm năng",
    qualified: "Đủ tiêu chuẩn",
    customer: "Khách hàng",
  };
  return map[stage];
}

export function getStageStyle(stage: Stage): { bg: string; text: string } {
  const map: Record<Stage, { bg: string; text: string }> = {
    potential: { bg: "var(--color-primary-light)", text: "var(--color-primary)" },
    qualified: { bg: "#D1FAE5", text: "#065F46" },
    customer: { bg: "#16A34A", text: "#FFFFFF" },
  };
  return map[stage];
}
