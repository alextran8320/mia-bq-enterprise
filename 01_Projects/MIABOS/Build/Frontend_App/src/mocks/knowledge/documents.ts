export type DocType = "FAQ" | "SOP" | "Policy" | "System Guide";
export type Domain = "Giá bán" | "Sản phẩm" | "Đổi trả" | "Vận hành";
export type DocStatus = "Published" | "Pending Review" | "Stale" | "Superseded";

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: DocType;
  domain: Domain;
  owner: string;
  status: DocStatus;
  effectiveDate: string;
  lastUpdated: string;
  body: string;
  sourceType: "SAP B1" | "KiotViet" | "Excel" | "Manual";
  scope: "Nội bộ" | "Store staff" | "Tất cả";
  supersededBy?: string;
}

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: "knw-001",
    title: "Chính sách chiết khấu đại lý Q2/2026",
    type: "Policy",
    domain: "Giá bán",
    owner: "Nguyễn Thanh Hà",
    status: "Published",
    effectiveDate: "2026-04-01",
    lastUpdated: "2026-04-16T08:00:00",
    body: "Chiết khấu áp dụng cho đại lý cấp 1: 15% trên giá niêm yết. Đại lý cấp 2: 10%. Điều kiện: đơn hàng tối thiểu 50 triệu/tháng. Không áp dụng cùng các chương trình khuyến mãi khác.",
    sourceType: "SAP B1",
    scope: "Nội bộ",
  },
  {
    id: "knw-002",
    title: "Quy trình đổi trả giày lỗi sản xuất",
    type: "SOP",
    domain: "Đổi trả",
    owner: "Trần Minh Khoa",
    status: "Published",
    effectiveDate: "2026-03-15",
    lastUpdated: "2026-04-10T10:00:00",
    body: "Bước 1: Tiếp nhận yêu cầu đổi trả từ khách. Bước 2: Kiểm tra hóa đơn và sản phẩm trong vòng 7 ngày kể từ ngày mua. Bước 3: Chụp ảnh lỗi và tạo phiếu đổi trả trên KiotViet. Bước 4: Chuyển sản phẩm về kho trung tâm trong 2 ngày làm việc. Bước 5: Xuất hàng mới hoặc hoàn tiền trong vòng 5 ngày làm việc.",
    sourceType: "Manual",
    scope: "Store staff",
  },
  {
    id: "knw-003",
    title: "FAQ: Tồn kho và thời gian giao hàng",
    type: "FAQ",
    domain: "Sản phẩm",
    owner: "Lê Thu Hương",
    status: "Stale",
    effectiveDate: "2026-02-01",
    lastUpdated: "2026-04-17T06:00:00",
    body: "H: Sản phẩm hết hàng có thể đặt trước không?\nA: Có, khách có thể đặt trước với cọc 30%. Thời gian có hàng dự kiến 7-14 ngày làm việc.\n\nH: Thời gian giao hàng nội thành?\nA: 1-2 ngày làm việc. Ngoại thành: 3-5 ngày làm việc.",
    sourceType: "KiotViet",
    scope: "Tất cả",
  },
  {
    id: "knw-004",
    title: "Hướng dẫn sử dụng hệ thống POS KiotViet",
    type: "System Guide",
    domain: "Vận hành",
    owner: "Phạm Đức Thắng",
    status: "Published",
    effectiveDate: "2026-01-15",
    lastUpdated: "2026-04-15T09:00:00",
    body: "Đăng nhập: Mở trình duyệt, truy cập pos.kiotviet.vn. Nhập tài khoản và mật khẩu cửa hàng. Tạo đơn hàng: Nhấn F2 hoặc biểu tượng '+'. Tìm sản phẩm theo mã vạch hoặc tên. Xác nhận thanh toán và in hóa đơn.",
    sourceType: "Manual",
    scope: "Store staff",
  },
  {
    id: "knw-005",
    title: "Chính sách bảo hành giày da cao cấp",
    type: "Policy",
    domain: "Đổi trả",
    owner: "Nguyễn Thanh Hà",
    status: "Superseded",
    effectiveDate: "2025-10-01",
    lastUpdated: "2026-03-01T00:00:00",
    body: "Bảo hành 6 tháng cho lỗi đế, 3 tháng cho lỗi da. [Phiên bản cũ — đã được thay thế]",
    sourceType: "Manual",
    scope: "Tất cả",
    supersededBy: "knw-006",
  },
  {
    id: "knw-006",
    title: "Chính sách bảo hành giày da cao cấp (v2)",
    type: "Policy",
    domain: "Đổi trả",
    owner: "Nguyễn Thanh Hà",
    status: "Published",
    effectiveDate: "2026-03-01",
    lastUpdated: "2026-04-01T08:00:00",
    body: "Bảo hành 12 tháng cho lỗi đế do sản xuất. Bảo hành 6 tháng cho lỗi da do sản xuất. Không bảo hành lỗi do sử dụng không đúng cách. Xuất trình hóa đơn khi yêu cầu bảo hành.",
    sourceType: "Manual",
    scope: "Tất cả",
  },
  {
    id: "knw-007",
    title: "Quy định chiết khấu khách hàng thân thiết",
    type: "Policy",
    domain: "Giá bán",
    owner: "Lê Thu Hương",
    status: "Pending Review",
    effectiveDate: "2026-05-01",
    lastUpdated: "2026-04-17T07:00:00",
    body: "Hạng Bạc (chi tiêu 5-15tr/năm): chiết khấu 5%. Hạng Vàng (15-30tr/năm): chiết khấu 8%. Hạng Kim Cương (>30tr/năm): chiết khấu 12% + ưu tiên hàng mới.",
    sourceType: "Manual",
    scope: "Tất cả",
  },
];

export const DOMAINS: Domain[] = ["Giá bán", "Sản phẩm", "Đổi trả", "Vận hành"];
export const DOC_TYPES: DocType[] = ["FAQ", "SOP", "Policy", "System Guide"];
