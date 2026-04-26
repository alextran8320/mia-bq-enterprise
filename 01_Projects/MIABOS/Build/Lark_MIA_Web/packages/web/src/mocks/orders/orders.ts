export type OrderType = "online" | "pos" | "erp" | "returned";
export type OrderWarningState = "none" | "stale" | "conflict" | "restricted";
export type OrderSummaryTone = "default" | "success" | "warning" | "danger";

export interface OrderSummaryItem {
  label: string;
  value: string;
  tone?: OrderSummaryTone;
}

export interface OrderLineItem {
  sku: string;
  productName: string;
  variant: string;
  qty: number;
  price: number;
}

export interface OrderTimelineItem {
  title: string;
  detail: string;
  timestamp: string;
}

export interface OrderPromo {
  id: string;
  code: string;
  name: string;
  validFrom: string;
  validTo: string;
  status: "Đang áp dụng" | "Hết hạn" | "Tạm dừng";
  discountDisplay: string;
  condition: string;
  appliedAmount: number;
  channel: string;
}

export interface OrderWarehouseSlipItem {
  sku: string;
  productName: string;
  variant: string;
  qty: number;
}

export interface OrderWarehouseSlip {
  id: string;
  slipCode: string;
  warehouse: string;
  createdAt: string;
  handler: string;
  status: "Đã xuất" | "Chờ xuất" | "Từ chối";
  note?: string;
  items: OrderWarehouseSlipItem[];
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  externalRef?: string;
  customerName: string;
  customerPhone: string;
  customerTier: string;
  salesChannel: string;
  branchName: string;
  ownerTeam: string;
  orderType: OrderType;
  statusLabel: string;
  fulfillmentStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  source: string;
  sourceSyncedAt: string;
  lastUpdated: string;
  createdAt: string;
  promisedDate?: string;
  deliveryPartner?: string;
  trackingCode?: string;
  orderValue: number;
  warningState: OrderWarningState;
  nextActionLabel: string;
  serviceNote: string;
  policyLinkLabel?: string;
  escalationAvailable: boolean;
  searchAliases: string[];
  summaryItems: OrderSummaryItem[];
  lineItems: OrderLineItem[];
  timelineItems: OrderTimelineItem[];
  promos: OrderPromo[];
  warehouseSlips: OrderWarehouseSlip[];
}

export type OrderSearchResult =
  | {
      kind: "found";
      records: OrderRecord[];
    }
  | {
      kind: "not_found";
      suggestions: string[];
    };

export interface OrderOverviewMetric {
  id: string;
  label: string;
  value: string;
  tone: OrderSummaryTone;
}

export const ORDER_QUICK_QUERIES = [
  { label: "Đang giao", query: "đang giao" },
  { label: "Online", query: "online" },
  { label: "POS", query: "pos" },
  { label: "Đổi trả", query: "đổi trả" },
  { label: "Cần đối soát", query: "đối soát" },
  { label: "Cần xử lý thêm", query: "review" },
] as const;

export const ORDERS: OrderRecord[] = [
  {
    id: "order-online-2048",
    orderCode: "BQ-ONLINE-2048",
    externalRef: "HV-45882041",
    customerName: "Nguyễn Minh Hà",
    customerPhone: "0909 123 456",
    customerTier: "Hạng Vàng",
    salesChannel: "Website BQ",
    branchName: "Kho online Tân Bình",
    ownerTeam: "CSKH Online",
    orderType: "online",
    statusLabel: "Đang giao",
    fulfillmentStatus: "Đã bàn giao cho đơn vị vận chuyển",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "Thẻ nội địa",
    source: "Haravan",
    sourceSyncedAt: "16/04/2026 - 09:18",
    lastUpdated: "16/04/2026 - 09:18",
    createdAt: "15/04/2026 - 20:31",
    promisedDate: "17/04/2026",
    deliveryPartner: "GHN",
    trackingCode: "GHN893420188",
    orderValue: 1280000,
    warningState: "none",
    nextActionLabel: "Chia sẻ mã vận đơn và ETA cho khách qua Zalo/điện thoại.",
    serviceNote: "Khách nhắn cần nhận trước 17h ngày mai để đi công tác.",
    escalationAvailable: false,
    searchAliases: ["online", "haravan", "ha", "0909123456", "ghn", "website", "đang giao"],
    summaryItems: [
      { label: "Loại đơn", value: "Online website" },
      { label: "Khách hàng", value: "Nguyễn Minh Hà" },
      { label: "Thanh toán", value: "Đã thanh toán", tone: "success" },
      { label: "Giá trị đơn", value: "1.280.000 đ" },
    ],
    lineItems: [
      { sku: "BQ-SND-01", productName: "Sandal da quai ngang", variant: "Đen / 39", qty: 1, price: 690000 },
      { sku: "BQ-ACC-11", productName: "Ví mini nữ", variant: "Kem", qty: 1, price: 590000 },
    ],
    timelineItems: [
      { title: "Tạo đơn", detail: "Đơn hàng phát sinh từ website BQ và đã xác nhận thanh toán.", timestamp: "15/04 - 20:31" },
      { title: "Đóng gói", detail: "Kho online đã hoàn tất đóng gói và in vận đơn.", timestamp: "16/04 - 07:45" },
      { title: "Bàn giao vận chuyển", detail: "GHN đã nhận hàng, dự kiến giao trong ngày mai.", timestamp: "16/04 - 09:18" },
    ],
    promos: [
      {
        id: "promo-urban-ease",
        code: "URBAN200",
        name: "Summer Launch Urban Ease",
        validFrom: "15/04/2026",
        validTo: "30/04/2026",
        status: "Đang áp dụng",
        discountDisplay: "Giảm 200.000 đ",
        condition: "Áp dụng cho đơn từ 999.000 đ, kênh online BQ",
        appliedAmount: 200000,
        channel: "Website / App BQ",
      },
    ],
    warehouseSlips: [
      {
        id: "whs-online-2048-001",
        slipCode: "PXK-2026-00841",
        warehouse: "Kho online Tân Bình",
        createdAt: "16/04/2026 - 07:30",
        handler: "Nguyễn Văn Kho",
        status: "Đã xuất",
        note: "Đóng gói hàng theo yêu cầu tặng kèm hộp gift.",
        items: [
          { sku: "BQ-SND-01", productName: "Sandal da quai ngang", variant: "Đen / 39", qty: 1 },
          { sku: "BQ-ACC-11", productName: "Ví mini nữ", variant: "Kem", qty: 1 },
        ],
      },
    ],
  },
  {
    id: "order-pos-8841",
    orderCode: "BQ-POS-8841",
    externalRef: "KV-0008841",
    customerName: "Trần Quang Duy",
    customerPhone: "0911 222 333",
    customerTier: "Khách lẻ",
    salesChannel: "Cửa hàng Quận 1",
    branchName: "BQ Flagship Q1",
    ownerTeam: "Store Ops Q1",
    orderType: "pos",
    statusLabel: "Đã xuất hóa đơn",
    fulfillmentStatus: "Nhận tại cửa hàng",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "Tiền mặt",
    source: "KiotViet",
    sourceSyncedAt: "16/04/2026 - 10:02",
    lastUpdated: "16/04/2026 - 10:02",
    createdAt: "16/04/2026 - 09:41",
    orderValue: 860000,
    warningState: "restricted",
    nextActionLabel: "Liên hệ cửa hàng nếu cần xác minh thông tin hóa đơn hoặc đổi size tại quầy.",
    serviceNote: "Vai trò hiện tại không được xem chi tiết giá trị giảm giá và thu ngân.",
    escalationAvailable: false,
    searchAliases: ["pos", "kiotviet", "invoice", "0911222333", "quận 1", "restricted", "hóa đơn"],
    summaryItems: [
      { label: "Loại đơn", value: "POS / Sales invoice" },
      { label: "Khách hàng", value: "Trần Quang Duy" },
      { label: "Chi tiết giao dịch", value: "Ẩn theo quyền", tone: "warning" },
      { label: "Giá trị đơn", value: "860.000 đ" },
    ],
    lineItems: [
      { sku: "BQ-MOC-22", productName: "Moccasin công sở", variant: "Nâu / 41", qty: 1, price: 860000 },
    ],
    timelineItems: [
      { title: "Phát sinh giao dịch", detail: "Hóa đơn được tạo tại quầy thu ngân cửa hàng Q1.", timestamp: "16/04 - 09:41" },
      { title: "Đồng bộ nội bộ", detail: "Dữ liệu tóm tắt đã đồng bộ sang workspace vận hành.", timestamp: "16/04 - 10:02" },
    ],
    promos: [
      {
        id: "promo-store-q1",
        code: "STORE100",
        name: "Ưu đãi khai trương bộ sưu tập Urban Ease",
        validFrom: "10/04/2026",
        validTo: "30/04/2026",
        status: "Đang áp dụng",
        discountDisplay: "Giảm 100.000 đ",
        condition: "Áp dụng tại cửa hàng chính hãng, đơn từ 800.000 đ",
        appliedAmount: 100000,
        channel: "Cửa hàng chính hãng Q1",
      },
    ],
    warehouseSlips: [
      {
        id: "whs-pos-8841-001",
        slipCode: "PXK-2026-00799",
        warehouse: "Cửa hàng Flagship Q1",
        createdAt: "16/04/2026 - 09:45",
        handler: "Trần Thị Sales",
        status: "Đã xuất",
        note: "Xuất tại quầy — khách mang về trực tiếp.",
        items: [
          { sku: "BQ-SNE-42", productName: "Sneaker canvas thể thao", variant: "Xanh navy / 42", qty: 1 },
          { sku: "BQ-MOC-22", productName: "Moccasin công sở", variant: "Nâu / 41", qty: 1 },
        ],
      },
    ],
  },
  {
    id: "order-erp-1172",
    orderCode: "BQ-ERP-1172",
    externalRef: "SAP-SO-1172",
    customerName: "Lê Hoài Nam",
    customerPhone: "0933 456 781",
    customerTier: "Đại lý Bạc",
    salesChannel: "Đơn phân bổ đại lý",
    branchName: "Kho trung tâm Bình Tân",
    ownerTeam: "Điều phối kho",
    orderType: "erp",
    statusLabel: "Đang xử lý kho",
    fulfillmentStatus: "Chờ cập nhật ETA từ kho",
    paymentStatus: "Đợi đối soát",
    paymentMethod: "Công nợ đại lý",
    source: "SAP B1",
    sourceSyncedAt: "15/04/2026 - 16:20",
    lastUpdated: "15/04/2026 - 16:20",
    createdAt: "15/04/2026 - 13:10",
    promisedDate: "17/04/2026",
    orderValue: 3240000,
    warningState: "stale",
    nextActionLabel: "Kiểm tra lại ETA với kho trung tâm trước khi cam kết lịch giao.",
    serviceNote: "Đơn đại lý cần ưu tiên cập nhật ETA vì ASM đã hỏi tình trạng giao liên tiếp 2 lần.",
    escalationAvailable: false,
    searchAliases: ["erp", "sap", "stale", "0933456781", "logistics", "đối soát", "đại lý"],
    summaryItems: [
      { label: "Loại đơn", value: "ERP / Logistics" },
      { label: "Khách hàng", value: "Lê Hoài Nam" },
      { label: "Độ mới dữ liệu", value: "Dữ liệu đã cũ > 12h", tone: "warning" },
      { label: "Giá trị đơn", value: "3.240.000 đ" },
    ],
    lineItems: [
      { sku: "BQ-SNE-90", productName: "Sneaker đế nhẹ", variant: "Trắng / 40", qty: 2, price: 980000 },
      { sku: "BQ-SND-10", productName: "Sandal nam quai da", variant: "Đen / 41", qty: 2, price: 640000 },
    ],
    timelineItems: [
      { title: "Tạo lệnh kho", detail: "ERP đã sinh chứng từ xuất kho cho đơn đại lý.", timestamp: "15/04 - 13:10" },
      { title: "Chờ phản hồi điều phối", detail: "Kho chưa gửi ETA mới sau khi gom hàng.", timestamp: "15/04 - 16:20" },
    ],
    promos: [],
    warehouseSlips: [
      {
        id: "whs-erp-1172-001",
        slipCode: "PXK-2026-00754",
        warehouse: "Kho Tân Bình",
        createdAt: "15/04/2026 - 13:30",
        handler: "Lê Văn Kho",
        status: "Chờ xuất",
        note: "Đơn B2B — cần gom đủ 2 loại trước khi xuất. Dự kiến xuất 17/04.",
        items: [
          { sku: "BQ-SNE-90", productName: "Sneaker đế nhẹ", variant: "Trắng / 40", qty: 2 },
          { sku: "BQ-SND-10", productName: "Sandal nam quai da", variant: "Đen / 41", qty: 2 },
        ],
      },
    ],
  },
  {
    id: "order-return-7780",
    orderCode: "BQ-RET-7780",
    externalRef: "HV-R-7780",
    customerName: "Phạm Gia An",
    customerPhone: "0988 111 204",
    customerTier: "Hạng Bạch Kim",
    salesChannel: "Website BQ",
    branchName: "Kho hoàn online",
    ownerTeam: "CSKH Sau bán",
    orderType: "returned",
    statusLabel: "Đang xử lý đổi trả",
    fulfillmentStatus: "Đã nhận hàng trả về",
    paymentStatus: "Chờ hoàn tiền",
    paymentMethod: "Ví điện tử",
    source: "Haravan",
    sourceSyncedAt: "16/04/2026 - 11:26",
    lastUpdated: "16/04/2026 - 11:26",
    createdAt: "13/04/2026 - 14:05",
    orderValue: 1490000,
    warningState: "none",
    nextActionLabel: "Mở chính sách đổi trả để xác nhận điều kiện hoàn tiền và thời hạn xử lý.",
    serviceNote: "Khách đổi size do form nhỏ; ưu tiên xử lý trong ngày vì khách đã tạo ticket từ hôm qua.",
    policyLinkLabel: "Chính sách đổi trả online",
    escalationAvailable: false,
    searchAliases: ["return", "doi tra", "policy", "0988111204", "returned", "hoàn tiền"],
    summaryItems: [
      { label: "Loại đơn", value: "Đơn đổi trả" },
      { label: "Khách hàng", value: "Phạm Gia An" },
      { label: "Tình trạng trả hàng", value: "Đã nhận hàng trả về", tone: "success" },
      { label: "Giá trị đơn", value: "1.490.000 đ" },
    ],
    lineItems: [
      { sku: "BQ-HEL-33", productName: "Giày cao gót basic", variant: "Kem / 37", qty: 1, price: 1490000 },
    ],
    timelineItems: [
      { title: "Yêu cầu đổi trả", detail: "CSKH đã xác nhận khách đổi size qua hotline.", timestamp: "15/04 - 09:02" },
      { title: "Nhận hàng trả", detail: "Kho online đã nhận hàng và chờ kiểm tra tình trạng sản phẩm.", timestamp: "16/04 - 11:26" },
    ],
    promos: [],
    warehouseSlips: [],
  },
  {
    id: "order-review-9914",
    orderCode: "BQ-CSKH-9914",
    externalRef: "HV-9914 / SAP-SO-20091",
    customerName: "Đỗ Khánh Linh",
    customerPhone: "0977 880 441",
    customerTier: "Hạng Vàng",
    salesChannel: "Website BQ + Call Center",
    branchName: "Kho online Tân Bình",
    ownerTeam: "CSKH Online / Logistics",
    orderType: "online",
    statusLabel: "Cần review",
    fulfillmentStatus: "Haravan: Đang giao / SAP: Chưa xuất kho",
    paymentStatus: "COD",
    paymentMethod: "COD",
    source: "Haravan + SAP B1",
    sourceSyncedAt: "16/04/2026 - 10:47",
    lastUpdated: "16/04/2026 - 10:47",
    createdAt: "15/04/2026 - 18:22",
    promisedDate: "16/04/2026",
    deliveryPartner: "J&T Express",
    trackingCode: "JTE22991881",
    orderValue: 1990000,
    warningState: "conflict",
    nextActionLabel: "Tạo yêu cầu xử lý cho team Ecommerce / Logistics để chốt trạng thái trước khi gọi lại khách.",
    serviceNote: "Khách gọi lên 2 lần hỏi lý do ứng dụng báo đang giao nhưng tổng đài kho lại nói chưa xuất kho.",
    policyLinkLabel: "Quy trình xử lý đơn giao vận có xung đột",
    escalationAvailable: true,
    searchAliases: ["conflict", "escalation", "cskh", "0977880441", "needs review", "đối soát", "j&t"],
    summaryItems: [
      { label: "Loại đơn", value: "Online website" },
      { label: "Khách hàng", value: "Đỗ Khánh Linh" },
      { label: "Nguồn", value: "Haravan + SAP B1", tone: "warning" },
      { label: "Giá trị đơn", value: "1.990.000 đ" },
    ],
    lineItems: [
      { sku: "BQ-SNE-77", productName: "Sneaker nữ cổ thấp", variant: "Trắng / 38", qty: 1, price: 1190000 },
      { sku: "BQ-BAG-09", productName: "Túi đeo chéo mini", variant: "Nâu", qty: 1, price: 800000 },
    ],
    timelineItems: [
      { title: "Haravan cập nhật", detail: "Đơn vị vận chuyển báo đã nhận đơn trên kênh online.", timestamp: "16/04 - 09:58" },
      { title: "SAP B1 cập nhật", detail: "ERP chưa xác nhận xuất kho thành công nên trạng thái đang lệch.", timestamp: "16/04 - 10:47" },
    ],
    promos: [
      {
        id: "promo-summer-sns",
        code: "SUMMER15",
        name: "Giảm 15% Sneaker hè 2026",
        validFrom: "01/04/2026",
        validTo: "30/04/2026",
        status: "Đang áp dụng",
        discountDisplay: "Giảm 15% (tối đa 300.000 đ)",
        condition: "Áp dụng cho SP Sneaker, kênh online, tài khoản đã xác minh",
        appliedAmount: 178500,
        channel: "Website / App BQ",
      },
      {
        id: "promo-member-gold",
        code: "GOLD50K",
        name: "Ưu đãi thành viên Hạng Vàng",
        validFrom: "01/01/2026",
        validTo: "31/12/2026",
        status: "Đang áp dụng",
        discountDisplay: "Giảm thêm 50.000 đ",
        condition: "Áp dụng cho khách Hạng Vàng trở lên, không giới hạn đơn tối thiểu",
        appliedAmount: 50000,
        channel: "Tất cả kênh",
      },
    ],
    warehouseSlips: [
      {
        id: "whs-review-9914-001",
        slipCode: "PXK-2026-00862",
        warehouse: "Kho online Tân Bình",
        createdAt: "16/04/2026 - 08:50",
        handler: "Nguyễn Văn Kho",
        status: "Chờ xuất",
        note: "Đang chờ xác nhận từ SAP B1 trước khi xuất kho chính thức.",
        items: [
          { sku: "BQ-SNE-77", productName: "Sneaker nữ cổ thấp", variant: "Trắng / 38", qty: 1 },
          { sku: "BQ-BAG-09", productName: "Túi đeo chéo mini", variant: "Nâu", qty: 1 },
        ],
      },
    ],
  },
];

export function getOrderById(id: string) {
  return ORDERS.find((record) => record.id === id) ?? null;
}

export function searchOrders(query: string): OrderSearchResult {
  const normalized = query.trim().toLowerCase();
  const normalizedCompact = normalized.split(" ").join("");

  const records =
    normalized.length === 0
      ? ORDERS
      : ORDERS.filter((order) => {
          const haystacks = [
            order.orderCode,
            order.externalRef ?? "",
            order.customerName,
            order.customerPhone,
            order.source,
            order.salesChannel,
            order.branchName,
            order.ownerTeam,
            order.statusLabel,
            order.paymentStatus,
            ...order.searchAliases,
          ];

          return haystacks.some((value) =>
            value
              .toLowerCase()
              .split(" ")
              .join("")
              .includes(normalizedCompact),
          );
        });

  if (records.length > 0) {
    return { kind: "found", records };
  }

  return {
    kind: "not_found",
    suggestions: [
      "Thử lại với mã đơn BQ-ONLINE-2048",
      "Hoặc tìm theo SĐT 0909 123 456",
      "Hoặc tìm theo tên Nguyễn Minh Hà",
    ],
  };
}

export function getOrderOverviewMetrics(records: OrderRecord[]): OrderOverviewMetric[] {
  const orderCount = records.length;
  const reviewCount = records.filter((record) => record.warningState === "conflict" || record.escalationAvailable).length;
  const staleCount = records.filter((record) => record.warningState === "stale").length;
  const revenue = records.reduce((sum, record) => sum + record.orderValue, 0);

  return [
    { id: "orders", label: "Đơn đang hiển thị", value: orderCount.toString(), tone: "default" },
    { id: "review", label: "Cần ưu tiên xử lý", value: reviewCount.toString(), tone: reviewCount > 0 ? "danger" : "default" },
    { id: "stale", label: "Nguồn cần cập nhật", value: staleCount.toString(), tone: staleCount > 0 ? "warning" : "default" },
    { id: "gmv", label: "Giá trị đơn", value: revenue.toLocaleString("vi-VN") + " đ", tone: "success" },
  ];
}
