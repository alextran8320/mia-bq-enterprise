export type DocType = "FAQ" | "SOP" | "Policy" | "System Guide";
export type KnowledgeTopic =
  | "Pricing Policy"
  | "Promotion Policy"
  | "Warranty & Return"
  | "Store Operation"
  | "Ecommerce Service"
  | "System Usage"
  | "CSKH Policy";
export type FolderCategory = "SOP" | "FAQ" | "Policy" | "System Guide" | "Imported";
export type DocStatus = "Published" | "Pending Review" | "Stale" | "Superseded";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PolicySection {
  heading: string;
  content: string;
}

export interface GuideStep {
  title: string;
  description: string;
  videoUrl?: string;
  screenshotUrl?: string;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: DocType;
  folder: FolderCategory;
  topic: KnowledgeTopic;
  owner: string;
  status: DocStatus;
  effectiveDate: string;
  lastUpdated: string;
  reviewCycleDays: number;
  body: string;
  sourceType: "SAP B1" | "KiotViet" | "Excel" | "Manual";
  scope: "Nội bộ" | "Store staff" | "Tất cả";
  supersededBy?: string;
  // Type-specific structured content
  faqItems?: FAQItem[];
  policySections?: PolicySection[];
  guideSteps?: GuideStep[];
  guideVideoUrl?: string;
  attachments?: { name: string; type: string; url: string }[];
}

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: "knw-001",
    title: "Chính sách chiết khấu đại lý Q2/2026",
    type: "Policy",
    folder: "Policy",
    topic: "Pricing Policy",
    owner: "Nguyễn Thanh Hà",
    status: "Published",
    effectiveDate: "2026-04-01",
    lastUpdated: "2026-04-16T08:00:00",
    reviewCycleDays: 90,
    body: "Chiết khấu áp dụng cho đại lý cấp 1: 15% trên giá niêm yết. Đại lý cấp 2: 10%. Điều kiện: đơn hàng tối thiểu 50 triệu/tháng. Không áp dụng cùng các chương trình khuyến mãi khác.",
    sourceType: "SAP B1",
    scope: "Nội bộ",
    policySections: [
      { heading: "Phạm vi áp dụng", content: "Áp dụng cho tất cả đại lý cấp 1 và cấp 2 của Giày BQ trên toàn quốc, hiệu lực từ Q2/2026." },
      { heading: "Mức chiết khấu", content: "Đại lý cấp 1: 15% trên giá niêm yết.\nĐại lý cấp 2: 10% trên giá niêm yết." },
      { heading: "Điều kiện áp dụng", content: "Đơn hàng tối thiểu 50 triệu/tháng.\nKhông áp dụng cùng các chương trình khuyến mãi khác.\nThanh toán trong vòng 30 ngày kể từ ngày xuất hóa đơn." },
      { heading: "Trường hợp loại trừ", content: "Sản phẩm đang trong đợt sale-off.\nSản phẩm limited edition.\nĐơn hàng dưới mức tối thiểu." },
    ],
    attachments: [
      { name: "Bang_chiet_khau_Q2_2026.xlsx", type: "excel", url: "#" },
      { name: "Hop_dong_dai_ly_mau.pdf", type: "pdf", url: "#" },
    ],
  },
  {
    id: "knw-002",
    title: "Quy trình đổi trả giày lỗi sản xuất",
    type: "SOP",
    folder: "SOP",
    topic: "Warranty & Return",
    owner: "Trần Minh Khoa",
    status: "Published",
    effectiveDate: "2026-03-15",
    lastUpdated: "2026-04-10T10:00:00",
    reviewCycleDays: 180,
    body: "Bước 1: Tiếp nhận yêu cầu đổi trả từ khách.\nBước 2: Kiểm tra hóa đơn và sản phẩm trong vòng 7 ngày kể từ ngày mua.\nBước 3: Chụp ảnh lỗi và tạo phiếu đổi trả trên KiotViet.\nBước 4: Chuyển sản phẩm về kho trung tâm trong 2 ngày làm việc.\nBước 5: Xuất hàng mới hoặc hoàn tiền trong vòng 5 ngày làm việc.",
    sourceType: "Manual",
    scope: "Store staff",
  },
  {
    id: "knw-003",
    title: "FAQ: Tồn kho và thời gian giao hàng",
    type: "FAQ",
    folder: "FAQ",
    topic: "CSKH Policy",
    owner: "Lê Thu Hương",
    status: "Stale",
    effectiveDate: "2026-02-01",
    lastUpdated: "2026-01-15T06:00:00",
    reviewCycleDays: 90,
    body: "H: Sản phẩm hết hàng có thể đặt trước không?\nA: Có, khách có thể đặt trước với cọc 30%. Thời gian có hàng dự kiến 7-14 ngày làm việc.\n\nH: Thời gian giao hàng nội thành?\nA: 1-2 ngày làm việc. Ngoại thành: 3-5 ngày làm việc.",
    sourceType: "KiotViet",
    scope: "Tất cả",
    faqItems: [
      { question: "Sản phẩm hết hàng có thể đặt trước không?", answer: "Có, khách có thể đặt trước với cọc 30%. Thời gian có hàng dự kiến 7-14 ngày làm việc." },
      { question: "Thời gian giao hàng nội thành?", answer: "1-2 ngày làm việc. Ngoại thành: 3-5 ngày làm việc." },
      { question: "Phí giao hàng là bao nhiêu?", answer: "Nội thành TP.HCM/HN: miễn phí cho đơn từ 500K. Ngoại thành: 30,000đ/đơn." },
      { question: "Có thể kiểm tra hàng trước khi nhận không?", answer: "Có, với đơn Ship COD khách được kiểm tra ngoại quan trước khi thanh toán." },
    ],
  },
  {
    id: "knw-004",
    title: "Hướng dẫn sử dụng hệ thống POS KiotViet",
    type: "System Guide",
    folder: "System Guide",
    topic: "System Usage",
    owner: "Phạm Đức Thắng",
    status: "Published",
    effectiveDate: "2026-01-15",
    lastUpdated: "2026-04-15T09:00:00",
    reviewCycleDays: 180,
    body: "Đăng nhập: Mở trình duyệt, truy cập pos.kiotviet.vn. Nhập tài khoản và mật khẩu cửa hàng.\n\nTạo đơn hàng: Nhấn F2 hoặc biểu tượng '+'. Tìm sản phẩm theo mã vạch hoặc tên.\n\nXác nhận thanh toán và in hóa đơn.",
    sourceType: "Manual",
    scope: "Store staff",
    guideVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    guideSteps: [
      { title: "Đăng nhập hệ thống", description: "Mở trình duyệt, truy cập pos.kiotviet.vn. Nhập tài khoản và mật khẩu cửa hàng được cấp.", screenshotUrl: "https://placehold.co/600x340/EFF6FF/2563EB?text=Login+Screen" },
      { title: "Tạo đơn hàng mới", description: "Nhấn phím F2 hoặc click biểu tượng '+' trên thanh công cụ. Hệ thống sẽ mở form đơn hàng mới.", screenshotUrl: "https://placehold.co/600x340/F0FDF4/16A34A?text=New+Order+Form" },
      { title: "Tìm và thêm sản phẩm", description: "Quét mã vạch bằng scanner hoặc nhập tên sản phẩm vào ô tìm kiếm. Click chọn sản phẩm để thêm vào đơn.", screenshotUrl: "https://placehold.co/600x340/FEF3C7/D97706?text=Product+Search" },
      { title: "Thanh toán và in hóa đơn", description: "Chọn phương thức thanh toán (Tiền mặt / Chuyển khoản / Quẹt thẻ). Nhấn 'Thanh toán' và in hóa đơn cho khách.", screenshotUrl: "https://placehold.co/600x340/F5F3FF/7C3AED?text=Payment+Screen" },
    ],
  },
  {
    id: "knw-005",
    title: "Chính sách bảo hành giày da cao cấp",
    type: "Policy",
    folder: "Policy",
    topic: "Warranty & Return",
    owner: "Nguyễn Thanh Hà",
    status: "Superseded",
    effectiveDate: "2025-10-01",
    lastUpdated: "2026-03-01T00:00:00",
    reviewCycleDays: 90,
    body: "Bảo hành 6 tháng cho lỗi đế, 3 tháng cho lỗi da. [Phiên bản cũ — đã được thay thế]",
    sourceType: "Manual",
    scope: "Tất cả",
    supersededBy: "knw-006",
    policySections: [
      { heading: "Thời hạn bảo hành", content: "Lỗi đế: 6 tháng.\nLỗi da: 3 tháng." },
    ],
  },
  {
    id: "knw-006",
    title: "Chính sách bảo hành giày da cao cấp (v2)",
    type: "Policy",
    folder: "Policy",
    topic: "Warranty & Return",
    owner: "Nguyễn Thanh Hà",
    status: "Published",
    effectiveDate: "2026-03-01",
    lastUpdated: "2026-04-01T08:00:00",
    reviewCycleDays: 90,
    body: "Bảo hành 12 tháng cho lỗi đế do sản xuất. Bảo hành 6 tháng cho lỗi da do sản xuất. Không bảo hành lỗi do sử dụng không đúng cách. Xuất trình hóa đơn khi yêu cầu bảo hành.",
    sourceType: "Manual",
    scope: "Tất cả",
    policySections: [
      { heading: "Thời hạn bảo hành", content: "Lỗi đế do sản xuất: 12 tháng kể từ ngày mua.\nLỗi da do sản xuất: 6 tháng kể từ ngày mua." },
      { heading: "Điều kiện bảo hành", content: "Xuất trình hóa đơn mua hàng hợp lệ.\nSản phẩm còn nguyên tem, nhãn mác.\nLỗi phải được xác định là do sản xuất." },
      { heading: "Trường hợp không bảo hành", content: "Lỗi do sử dụng không đúng cách.\nSản phẩm đã qua sửa chữa bên ngoài.\nHết thời hạn bảo hành.\nKhông có hóa đơn mua hàng." },
      { heading: "Quy trình bảo hành", content: "1. Mang sản phẩm đến cửa hàng BQ gần nhất.\n2. Nhân viên kiểm tra và xác nhận lỗi.\n3. Chuyển về trung tâm bảo hành trong 3 ngày.\n4. Trả hàng sau bảo hành trong 7-10 ngày làm việc." },
    ],
  },
  {
    id: "knw-007",
    title: "Quy định chiết khấu khách hàng thân thiết",
    type: "Policy",
    folder: "Policy",
    topic: "Promotion Policy",
    owner: "Lê Thu Hương",
    status: "Pending Review",
    effectiveDate: "2026-05-01",
    lastUpdated: "2026-04-17T07:00:00",
    reviewCycleDays: 90,
    body: "Hạng Bạc (chi tiêu 5-15tr/năm): chiết khấu 5%. Hạng Vàng (15-30tr/năm): chiết khấu 8%. Hạng Kim Cương (>30tr/năm): chiết khấu 12% + ưu tiên hàng mới.",
    sourceType: "Manual",
    scope: "Tất cả",
    policySections: [
      { heading: "Hạng thành viên & Chiết khấu", content: "Hạng Bạc (chi tiêu 5-15 triệu/năm): chiết khấu 5%.\nHạng Vàng (chi tiêu 15-30 triệu/năm): chiết khấu 8%.\nHạng Kim Cương (chi tiêu >30 triệu/năm): chiết khấu 12% + ưu tiên hàng mới." },
      { heading: "Điều kiện duy trì hạng", content: "Tổng chi tiêu trong 12 tháng gần nhất đạt mức quy định.\nĐánh giá lại mỗi quý.\nKhách hàng bị hạ hạng nếu không đạt mức chi tiêu tối thiểu trong 2 quý liên tiếp." },
      { heading: "Quyền lợi bổ sung", content: "Hạng Kim Cương: Mời sự kiện VIP, quà sinh nhật, tư vấn riêng.\nHạng Vàng: Quà sinh nhật, ưu tiên đổi trả.\nHạng Bạc: Tích điểm đổi quà." },
    ],
  },
  {
    id: "knw-008",
    title: "SOP xử lý khiếu nại khách hàng online",
    type: "SOP",
    folder: "SOP",
    topic: "Ecommerce Service",
    owner: "Trần Minh Khoa",
    status: "Published",
    effectiveDate: "2026-02-01",
    lastUpdated: "2026-04-12T09:00:00",
    reviewCycleDays: 90,
    body: "Bước 1: Tiếp nhận khiếu nại qua Zalo/Facebook/Email.\nBước 2: Phản hồi trong vòng 2 giờ làm việc.\nBước 3: Kiểm tra đơn hàng trên hệ thống và xác minh vấn đề.\nBước 4: Đề xuất giải pháp: đổi hàng, hoàn tiền, hoặc bồi thường.\nBước 5: Ghi nhận vào hệ thống CRM và đóng ticket.",
    sourceType: "Manual",
    scope: "Tất cả",
  },
];

export const FOLDER_CATEGORIES: FolderCategory[] = ["SOP", "FAQ", "Policy", "System Guide", "Imported"];
export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  "Pricing Policy",
  "Promotion Policy",
  "Warranty & Return",
  "Store Operation",
  "Ecommerce Service",
  "System Usage",
  "CSKH Policy",
];

export function isStaleDoc(doc: KnowledgeDoc): boolean {
  const daysSinceUpdate = (Date.now() - new Date(doc.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceUpdate > doc.reviewCycleDays;
}
