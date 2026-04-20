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
  {
    id: "knw-009",
    title: "Hướng dẫn sử dụng Haravan — Quản lý đơn hàng online",
    type: "System Guide",
    folder: "System Guide",
    topic: "System Usage",
    owner: "Phạm Đức Thắng",
    status: "Published",
    effectiveDate: "2026-03-01",
    lastUpdated: "2026-04-17T08:30:00",
    reviewCycleDays: 180,
    body: "Truy cập bảng điều khiển Haravan để quản lý đơn hàng online từ website giaybq.com.vn và các kênh thương mại điện tử. Xử lý xác nhận đơn, giao hàng và hoàn hàng trên một giao diện thống nhất.",
    sourceType: "Manual",
    scope: "Store staff",
    guideSteps: [
      { title: "Đăng nhập Haravan", description: "Truy cập app.haravan.com, nhập email và mật khẩu tài khoản BQ được cấp.", screenshotUrl: "https://placehold.co/600x340/EFF6FF/2563EB?text=Haravan+Login" },
      { title: "Xem danh sách đơn hàng mới", description: "Vào mục Đơn hàng → chọn bộ lọc 'Chờ xác nhận'. Đơn mới sẽ hiển thị màu vàng.", screenshotUrl: "https://placehold.co/600x340/FFFBEB/D97706?text=Order+List" },
      { title: "Xác nhận và chỉ định kho giao", description: "Mở đơn → kiểm tra địa chỉ giao → chọn kho phù hợp → nhấn 'Xác nhận giao hàng'.", screenshotUrl: "https://placehold.co/600x340/F0FDF4/16A34A?text=Confirm+Order" },
      { title: "In phiếu giao hàng & bàn giao cho đơn vị vận chuyển", description: "Nhấn 'In vận đơn' → in phiếu giao → dán lên kiện hàng → ghi lại mã vận đơn vào hệ thống.", screenshotUrl: "https://placehold.co/600x340/F5F3FF/7C3AED?text=Print+Label" },
    ],
    attachments: [
      { name: "Haravan_Quick_Reference_BQ.pdf", type: "pdf", url: "#" },
    ],
  },
  {
    id: "knw-010",
    title: "FAQ: Chính sách giá và chiết khấu khách lẻ",
    type: "FAQ",
    folder: "FAQ",
    topic: "Pricing Policy",
    owner: "Nguyễn Thanh Hà",
    status: "Published",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-04-15T10:00:00",
    reviewCycleDays: 90,
    body: "Tổng hợp câu hỏi thường gặp về chính sách giá bán lẻ, áp dụng voucher, và nguyên tắc 1 giá của Giày BQ.",
    sourceType: "SAP B1",
    scope: "Tất cả",
    faqItems: [
      { question: "Giày BQ có chính sách 1 giá không?", answer: "Có. BQ áp dụng chính sách 1 giá toàn hệ thống — giá niêm yết trên sản phẩm là giá bán chính thức, không thương lượng. Khuyến mãi theo chương trình chính thức vẫn được áp dụng theo quy định." },
      { question: "Khách lẻ có được chiết khấu thêm ngoài CTKM không?", answer: "Không. Ngoài các chương trình khuyến mãi chính thức, nhân viên không được tự ý giảm giá cho khách lẻ. Nếu khách yêu cầu, hướng dẫn đăng ký thành viên để tích lũy điểm." },
      { question: "Giá trên website có giống giá tại cửa hàng không?", answer: "Có, BQ đồng nhất giá online và offline. Nếu phát hiện lệch giá, nhân viên báo ngay cho quản lý để điều chỉnh trên cả hai kênh." },
      { question: "Voucher mua hàng online có dùng tại cửa hàng được không?", answer: "Tùy loại voucher. Voucher ghi rõ 'Online only' chỉ áp dụng trên website. Voucher không ghi giới hạn kênh thì dùng được cả offline, nhân viên nhập mã thủ công vào POS KiotViet." },
      { question: "Nhân viên mua giày nội bộ được giảm bao nhiêu?", answer: "Nhân viên chính thức được hưởng chiết khấu 20% trên giá niêm yết. Tối đa 2 đôi/tháng. Xuất trình thẻ nhân viên khi mua." },
    ],
  },
  {
    id: "knw-011",
    title: "SOP kiểm kho cuối ngày và đối soát tồn kho",
    type: "SOP",
    folder: "SOP",
    topic: "Store Operation",
    owner: "Trần Minh Khoa",
    status: "Published",
    effectiveDate: "2026-01-15",
    lastUpdated: "2026-04-10T17:00:00",
    reviewCycleDays: 90,
    body: "Quy trình kiểm kho cuối ngày đảm bảo số liệu KiotViet khớp với hàng vật lý tại quầy. Thực hiện bắt buộc trước khi đóng ca tối.",
    sourceType: "Manual",
    scope: "Store staff",
    guideSteps: [
      { title: "Chạy báo cáo tồn kho cuối ngày trên KiotViet", description: "Vào Báo cáo → Tồn kho → Chọn ngày hôm nay → Xuất danh sách SKU và số lượng tồn." },
      { title: "Đếm hàng vật lý tại kho và quầy trưng bày", description: "Đếm theo từng SKU, ghi số lượng thực tế vào phiếu kiểm kho. Ít nhất 2 nhân viên ký xác nhận." },
      { title: "Đối chiếu hệ thống và thực tế", description: "So sánh số liệu KiotViet và số đếm thực tế. Chênh lệch trên 2 đôi/SKU cần ghi rõ lý do và báo Quản lý cửa hàng." },
      { title: "Cập nhật điều chỉnh tồn kho nếu có sai lệch nhỏ", description: "Với sai lệch ≤ 1 đôi/SKU được gây ra bởi lỗi nhập liệu: nhân viên được phép điều chỉnh trong KiotViet kèm ghi chú lý do." },
      { title: "Lưu phiếu kiểm kho và gửi báo cáo lên quản lý vùng", description: "Scan phiếu kiểm kho vật lý và upload lên hệ thống. Gửi email tóm tắt cho Quản lý vùng trước 22:00." },
    ],
  },
  {
    id: "knw-012",
    title: "Chính sách giao hàng và phí vận chuyển — kênh online 2026",
    type: "Policy",
    folder: "Policy",
    topic: "Ecommerce Service",
    owner: "Lê Thu Hương",
    status: "Published",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-04-14T09:00:00",
    reviewCycleDays: 90,
    body: "Quy định về SLA giao hàng, điều kiện miễn phí vận chuyển và xử lý sự cố giao hàng cho kênh thương mại điện tử của BQ.",
    sourceType: "Manual",
    scope: "Tất cả",
    policySections: [
      { heading: "Phí vận chuyển", content: "Nội thành TP.HCM và Hà Nội: Miễn phí cho đơn từ 699.000đ trở lên.\nToàn quốc: Miễn phí cho đơn từ 999.000đ trở lên.\nĐơn dưới mức miễn phí: 30.000đ/đơn nội thành, 40.000đ/đơn ngoại thành." },
      { heading: "Thời gian giao hàng chuẩn", content: "Nội thành TP.HCM / Hà Nội / Đà Nẵng: 1–2 ngày làm việc.\nCác tỉnh thành còn lại: 3–5 ngày làm việc.\nKhu vực đảo, vùng sâu: 5–7 ngày làm việc." },
      { heading: "Giao nhanh (Express)", content: "Chỉ áp dụng tại TP.HCM và Hà Nội.\nGiao trong ngày (Same-day) cho đơn đặt trước 10:00.\nGiao trong 4 giờ (Express 4h) cho đơn đặt trước 14:00.\nPhụ phí Express: 49.000đ/đơn." },
      { heading: "Xử lý đơn bị giao thất bại", content: "Đơn giao thất bại lần 1: Hệ thống tự động lên lịch giao lại trong ngày làm việc tiếp theo.\nGiao thất bại lần 2: CSKH liên hệ khách xác nhận địa chỉ và lịch nhận hàng.\nGiao thất bại lần 3: Đơn được hoàn về kho, khách cần đặt lại hoặc nhận tại cửa hàng." },
    ],
    attachments: [
      { name: "Bang_gia_phi_van_chuyen_2026.pdf", type: "pdf", url: "#" },
    ],
  },
  {
    id: "knw-013",
    title: "FAQ: Tồn kho và tra cứu sản phẩm theo mã SKU",
    type: "FAQ",
    folder: "FAQ",
    topic: "Store Operation",
    owner: "Phạm Đức Thắng",
    status: "Published",
    effectiveDate: "2026-02-15",
    lastUpdated: "2026-04-18T08:00:00",
    reviewCycleDays: 60,
    body: "Hướng dẫn tra cứu tồn kho và thông tin sản phẩm theo mã SKU BQ trên hệ thống KiotViet và SAP B1.",
    sourceType: "KiotViet",
    scope: "Store staff",
    faqItems: [
      { question: "Mã SKU BQ theo format nào?", answer: "Mã SKU BQ theo format BQ-XXXX, ví dụ BQ-2301 (giày da nam), BQ-1102 (dép thể thao nữ). Các số sau BQ không có ý nghĩa cụ thể ngoài mục đích phân loại nội bộ." },
      { question: "Tra cứu tồn kho theo mã SKU ở đâu?", answer: "Trên KiotViet POS: vào Kho hàng → Tồn kho → nhập mã SKU vào ô tìm kiếm. Kết quả hiển thị tồn theo từng chi nhánh và kho. SAP B1 là nguồn tham chiếu khi cần số liệu đối soát." },
      { question: "Số liệu KiotViet và SAP B1 khác nhau thì tin vào đâu?", answer: "SAP B1 là nguồn chân lý (source of truth) cho số liệu sau kiểm kho đã đối soát. KiotViet phản ánh tồn kho thời gian thực nhưng có độ trễ do sync. Nếu lệch trên 3 đôi, báo cáo Quản lý để xử lý." },
      { question: "Sản phẩm không có trong KiotViet — tìm ở đâu?", answer: "Kiểm tra trong SAP B1 mục Item Master Data. Nếu không có trong cả hai hệ thống, có thể sản phẩm đã bị ngừng bán — liên hệ phòng Mua hàng để xác nhận." },
      { question: "Làm thế nào để biết sản phẩm nào sắp hết hàng?", answer: "Trên KiotViet: vào Báo cáo → Sắp hết hàng → đặt ngưỡng cảnh báo (mặc định 5 đôi/SKU). Hệ thống gửi thông báo tự động khi tồn dưới ngưỡng." },
    ],
  },
  {
    id: "knw-014",
    title: "Quy trình tuyển dụng nhân viên cửa hàng",
    type: "SOP",
    folder: "SOP",
    topic: "Store Operation",
    owner: "Nguyễn Thanh Hà",
    status: "Published",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-04-05T09:00:00",
    reviewCycleDays: 180,
    body: "Quy trình chuẩn tuyển dụng nhân viên bán hàng, thu ngân và quản lý kho cho chuỗi cửa hàng BQ trên toàn quốc.",
    sourceType: "Manual",
    scope: "Nội bộ",
    guideSteps: [
      { title: "Đề xuất nhu cầu tuyển dụng", description: "Quản lý cửa hàng gửi form đề xuất tuyển dụng về phòng HR ít nhất 2 tuần trước ngày cần người." },
      { title: "Đăng tin tuyển dụng", description: "HR đăng tin trên nội bộ, TopCV và fanpage BQ. Mô tả công việc theo template chuẩn." },
      { title: "Sàng lọc hồ sơ", description: "HR sàng lọc dựa trên tiêu chí: tốt nghiệp THPT trở lên, ưu tiên có kinh nghiệm bán hàng, ngoại hình gọn gàng, sức khỏe tốt." },
      { title: "Phỏng vấn trực tiếp", description: "Quản lý cửa hàng phỏng vấn trực tiếp. Đánh giá giao tiếp, thái độ phục vụ và kiến thức sản phẩm cơ bản." },
      { title: "Onboarding và thử việc 2 tháng", description: "Nhân viên mới được đào tạo sản phẩm, SOP bán hàng và hệ thống POS trong tuần đầu. Thử việc 2 tháng trước khi ký hợp đồng chính thức." },
    ],
  },
  {
    id: "knw-015",
    title: "Hướng dẫn tích hợp SAP B1 — Tra cứu tồn kho và giá vốn",
    type: "System Guide",
    folder: "System Guide",
    topic: "System Usage",
    owner: "Phạm Đức Thắng",
    status: "Published",
    effectiveDate: "2026-02-01",
    lastUpdated: "2026-04-16T10:00:00",
    reviewCycleDays: 180,
    body: "Hướng dẫn tra cứu tồn kho kho trung tâm, giá vốn và thông tin sản phẩm trên SAP Business One dành cho nhân viên kế toán và quản lý kho.",
    sourceType: "SAP B1",
    scope: "Nội bộ",
    guideSteps: [
      { title: "Truy cập SAP B1 Client", description: "Mở SAP Business One Client trên máy tính được cấp. Đăng nhập bằng User ID và mật khẩu SAP riêng (khác với KiotViet).", screenshotUrl: "https://placehold.co/600x340/EFF6FF/2563EB?text=SAP+Login" },
      { title: "Tra cứu Item Master Data", description: "Vào Inventory → Item Master Data → nhập mã SKU BQ-XXXX vào ô Item No. Thông tin hiển thị: tên sản phẩm, đơn vị, giá vốn, tồn kho tại các warehouse.", screenshotUrl: "https://placehold.co/600x340/F0FDF4/16A34A?text=Item+Master" },
      { title: "Xem báo cáo tồn kho theo kho", description: "Vào Inventory Reports → Inventory Audit Report hoặc Stock Posting List. Chọn warehouse cần xem và khoảng thời gian.", screenshotUrl: "https://placehold.co/600x340/FEF3C7/D97706?text=Stock+Report" },
      { title: "Tra cứu giá vốn và A/P Invoice", description: "Vào Purchasing → A/P Invoice để tra lịch sử nhập hàng và giá vốn mua vào theo từng lô. Dữ liệu SAP B1 là nguồn chính xác nhất cho báo cáo tài chính.", screenshotUrl: "https://placehold.co/600x340/F5F3FF/7C3AED?text=AP+Invoice" },
    ],
    attachments: [
      { name: "SAP_B1_User_Guide_BQ_v2.pdf", type: "pdf", url: "#" },
      { name: "SAP_Warehouse_Code_List.xlsx", type: "excel", url: "#" },
    ],
  },
  {
    id: "knw-016",
    title: "FAQ: Chương trình khuyến mãi — Phạm vi và điều kiện áp dụng",
    type: "FAQ",
    folder: "FAQ",
    topic: "Promotion Policy",
    owner: "Lê Thu Hương",
    status: "Published",
    effectiveDate: "2026-04-01",
    lastUpdated: "2026-04-18T07:30:00",
    reviewCycleDays: 30,
    body: "Câu hỏi thường gặp về phạm vi áp dụng CTKM, điều kiện kết hợp voucher, và cách tra cứu CTKM đang hiệu lực.",
    sourceType: "Manual",
    scope: "Tất cả",
    faqItems: [
      { question: "CTKM tháng này áp dụng cho cửa hàng chính hãng gồm những gì?", answer: "Tháng 4/2026: Giảm 20% toàn bộ sản phẩm da nam tại cửa hàng chính hãng (không áp dụng đại lý). Giảm 15% giày thể thao khi mua từ 2 đôi. Chi tiết xem CTKM-2026-001 trong hệ thống." },
      { question: "CTKM giảm giá có áp dụng cùng voucher không?", answer: "Không. Theo chính sách hiện hành, CTKM theo chương trình và voucher giảm giá không được cộng dồn. Khách hàng chỉ được áp dụng một trong hai — hệ thống POS tự động chọn phương án có lợi hơn cho khách." },
      { question: "Đại lý có được hưởng CTKM dành cho cửa hàng chính hãng không?", answer: "Không. CTKM dành cho cửa hàng chính hãng không áp dụng cho đại lý. Đại lý có bảng giá và chiết khấu riêng theo hợp đồng đại lý đã ký." },
      { question: "Làm thế nào để biết CTKM nào đang hiệu lực?", answer: "Tra cứu trong KiotViet: Cài đặt → Chương trình khuyến mãi → Đang chạy. Hoặc hỏi trực tiếp AI Trợ lý với câu 'CTKM đang áp dụng là gì?' để lấy thông tin cập nhật nhất." },
    ],
  },
  {
    id: "knw-017",
    title: "Chính sách mở cửa hàng mới và tiêu chuẩn nhượng quyền",
    type: "Policy",
    folder: "Policy",
    topic: "Store Operation",
    owner: "Nguyễn Thanh Hà",
    status: "Published",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-03-20T09:00:00",
    reviewCycleDays: 180,
    body: "Tiêu chuẩn và quy trình mở cửa hàng mới cho cả mô hình cửa hàng trực thuộc và đại lý nhượng quyền của Giày BQ.",
    sourceType: "Manual",
    scope: "Nội bộ",
    policySections: [
      { heading: "Tiêu chuẩn mặt bằng", content: "Diện tích tối thiểu: 50m² (cửa hàng trực thuộc), 30m² (đại lý).\nVị trí: Mặt tiền đường lớn, gần khu dân cư hoặc trung tâm thương mại.\nMặt tiền tối thiểu: 5m.\nCần được Ban điều hành phê duyệt trước khi ký hợp đồng thuê." },
      { heading: "Điều kiện đại lý nhượng quyền", content: "Vốn đầu tư ban đầu: từ 300 triệu đồng.\nKý quỹ thương hiệu: 50 triệu đồng.\nĐào tạo bắt buộc: 2 tuần tại cửa hàng mẫu.\nKhông được kinh doanh sản phẩm của đối thủ tại cùng địa điểm." },
      { heading: "Quy trình phê duyệt", content: "1. Nộp hồ sơ xin mở cửa hàng về phòng Phát triển chuỗi.\n2. Khảo sát thực địa bởi đại diện BQ trong 5 ngày làm việc.\n3. Ký kết hợp đồng nhượng quyền sau khi được phê duyệt.\n4. Thi công và lắp đặt theo thiết kế chuẩn BQ.\n5. Khai trương trong vòng 60 ngày sau khi ký hợp đồng." },
    ],
  },
  {
    id: "knw-018",
    title: "SOP xử lý tồn kho chậm bán và hàng cần thanh lý",
    type: "SOP",
    folder: "SOP",
    topic: "Store Operation",
    owner: "Trần Minh Khoa",
    status: "Published",
    effectiveDate: "2026-02-01",
    lastUpdated: "2026-04-08T11:00:00",
    reviewCycleDays: 90,
    body: "Quy trình nhận diện, xử lý và báo cáo hàng tồn kho chậm bán trước khi đề xuất thanh lý hoặc chuyển kho.",
    sourceType: "SAP B1",
    scope: "Nội bộ",
    guideSteps: [
      { title: "Chạy báo cáo hàng chậm bán định kỳ", description: "Mỗi tháng, phòng Kế hoạch chạy báo cáo từ SAP B1: hàng tồn kho trên 90 ngày chưa bán. Kết quả gửi cho các Quản lý khu vực." },
      { title: "Phân loại hàng theo nhóm xử lý", description: "Nhóm A (tồn 90–180 ngày): chuyển sang cửa hàng có nhu cầu cao hơn.\nNhóm B (tồn 180–365 ngày): giảm giá tối đa 30% theo CTKM nội bộ.\nNhóm C (tồn >365 ngày): đề xuất thanh lý." },
      { title: "Phê duyệt phương án xử lý", description: "Quản lý khu vực trình phương án lên Ban điều hành. Cần phê duyệt bằng văn bản trước khi thực hiện giảm giá Nhóm B hoặc thanh lý Nhóm C." },
      { title: "Thực hiện chuyển kho hoặc điều chỉnh giá", description: "Chuyển kho: tạo lệnh điều chuyển trên SAP B1 và cập nhật KiotViet sau khi hàng đến nơi.\nGiảm giá: tạo CTKM nội bộ trên KiotViet, có thời hạn cụ thể." },
    ],
  },
  {
    id: "knw-019",
    title: "FAQ: Quy trình đặt hàng và nhập hàng từ nhà cung cấp",
    type: "FAQ",
    folder: "FAQ",
    topic: "Store Operation",
    owner: "Phạm Đức Thắng",
    status: "Pending Review",
    effectiveDate: "2026-05-01",
    lastUpdated: "2026-04-17T14:00:00",
    reviewCycleDays: 90,
    body: "Hướng dẫn về quy trình đặt hàng, nhập kho và đối soát hàng nhận cho phòng Mua hàng và kho trung tâm.",
    sourceType: "SAP B1",
    scope: "Nội bộ",
    faqItems: [
      { question: "Đặt hàng nhà cung cấp được thực hiện trên hệ thống nào?", answer: "Toàn bộ đơn đặt hàng (Purchase Order) được tạo và quản lý trên SAP B1 bởi phòng Mua hàng. KiotViet không dùng cho quá trình đặt hàng đầu vào." },
      { question: "Thời gian nhập hàng từ nhà cung cấp thông thường là bao lâu?", answer: "Nhà cung cấp trong nước: 5–10 ngày làm việc kể từ ngày xác nhận PO. Hàng nhập khẩu: 30–45 ngày. Mùa cao điểm (Tết, Back-to-School): đặt hàng sớm thêm 2 tuần." },
      { question: "Khi nhận hàng cần kiểm tra những gì?", answer: "Đối chiếu số lượng với PO trên SAP B1. Kiểm tra chất lượng bề ngoài (lỗi da, đế, tem nhãn). Nhập kho trên SAP B1 (A/P Goods Receipt) trong ngày nhận hàng. Ghi chú hàng lỗi để yêu cầu đổi trả nhà cung cấp." },
    ],
  },
  {
    id: "knw-020",
    title: "Chính sách khen thưởng và KPI nhân viên bán hàng",
    type: "Policy",
    folder: "Policy",
    topic: "Store Operation",
    owner: "Nguyễn Thanh Hà",
    status: "Published",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-04-01T08:00:00",
    reviewCycleDays: 180,
    body: "Khung KPI và cơ chế khen thưởng cho nhân viên bán hàng tại chuỗi cửa hàng BQ, áp dụng từ Q1/2026.",
    sourceType: "Manual",
    scope: "Nội bộ",
    policySections: [
      { heading: "KPI cơ bản", content: "Doanh số cá nhân tháng: chỉ tiêu do Quản lý cửa hàng giao dựa trên lịch sử tháng trước.\nTỉ lệ đổi trả/khiếu nại: mục tiêu < 2% trên tổng đơn phụ trách.\nChất lượng phục vụ (NPS): điểm từ 8.0/10 trở lên." },
      { heading: "Thưởng vượt chỉ tiêu", content: "Đạt 100–110% chỉ tiêu: thưởng 300.000đ.\nĐạt 110–120%: thưởng 600.000đ.\nĐạt trên 120%: thưởng 1.000.000đ.\nThưởng chi trả cùng lương tháng tiếp theo." },
      { heading: "Khen thưởng đặc biệt", content: "Nhân viên xuất sắc tháng: tuyên dương nội bộ + thưởng 500.000đ.\nNhân viên xuất sắc quý: tặng 1 ngày nghỉ phép + thưởng 2.000.000đ.\nTop 3 toàn hệ thống cả năm: thưởng chuyến du lịch 2 ngày." },
    ],
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
