export type CatalogWarningState =
  | "none"
  | "stale"
  | "conflict"
  | "restricted"
  | "needs_review";

export type CatalogSummaryTone = "default" | "success" | "warning" | "danger";
export type ChannelFilter = "all" | "ecommerce" | "store" | "dealer";
export type StoreTypeFilter = "all" | "official" | "dealer";
export type BranchFilter =
  | "all"
  | "kho_tan_binh"
  | "flagship_q1"
  | "vincom_thu_duc"
  | "showroom_da_nang";

export interface CatalogSummaryItem {
  label: string;
  value: string;
  tone?: CatalogSummaryTone;
}

export interface CatalogAttribute {
  label: string;
  value: string;
}

export interface CatalogVariant {
  id: string;
  sku: string;
  barcode: string;
  color: string;
  size: string;
  availabilityLabel: string;
}

export interface SourceTraceItem {
  system: string;
  field: string;
  value: string;
  syncedAt: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  branchId: BranchFilter;
  channel: Exclude<ChannelFilter, "all">;
  storeType: Exclude<StoreTypeFilter, "all">;
  scopeLabel: string;
  availabilityLabel: string;
  quantityLabel: string;
  freshnessLabel: string;
  source: string;
  syncedAt: string;
  warningState: CatalogWarningState;
  nextAction: string;
}

export interface PricingContext {
  id: string;
  channel: Exclude<ChannelFilter, "all">;
  storeType: Exclude<StoreTypeFilter, "all">;
  contextLabel: string;
  basePrice: string;
  finalPrice: string;
  promotionLabel?: string;
  source: string;
  syncedAt: string;
  warningState: CatalogWarningState;
  traceNote: string;
}

export interface PromotionOffer {
  id: string;
  channel: Exclude<ChannelFilter, "all">;
  storeType: Exclude<StoreTypeFilter, "all">;
  name: string;
  discountLabel: string;
  conditionLabel: string;
  scopeLabel: string;
  validRange: string;
  source: string;
  publicSafeLabel: string;
  warningState: CatalogWarningState;
  note: string;
}

export type SyncStatus = "success" | "failed" | "syncing";

export interface ProductRelatedOrder {
  id: string;
  orderCode: string;
  customer: string;
  phone: string;
  color: string;
  size: string;
  qty: number;
  value: number;
  status: string;
  channel: string;
  createdAt: string;
}

export interface CatalogRecord {
  id: string;
  canonicalId: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  collection: string;
  season: string;
  material: string;
  source: string;
  syncedAt: string;
  projectionScope: string;
  warningState: CatalogWarningState;
  ownerTeam: string;
  serviceNote: string;
  description: string;
  /** Ảnh sản phẩm */
  imageUrl: string;
  /** Ngành hàng */
  industry: string;
  /** Tồn treo */
  stockPending: number;
  /** Tồn có sẵn */
  stockAvailable: number;
  /** Tồn thực tế */
  stockActual: number;
  /** VAT % */
  vat: number;
  /** Trạng thái đồng bộ */
  syncStatus: SyncStatus;
  /** Số đơn vị đã bán */
  unitsSold: number;
  /** Doanh thu */
  revenue: number;
  /** Màu bán chạy nhất */
  topSellingColor: string;
  /** Size bán chạy nhất */
  topSellingSize: string;
  /** Đơn hàng liên quan */
  relatedOrders: ProductRelatedOrder[];
  summaryItems: CatalogSummaryItem[];
  attributes: CatalogAttribute[];
  variants: CatalogVariant[];
  sourceTrace: SourceTraceItem[];
  inventoryLocations: InventoryLocation[];
  pricingContexts: PricingContext[];
  promotions: PromotionOffer[];
  searchAliases: string[];
}

export interface CatalogSearchFilters {
  query: string;
  channel: ChannelFilter;
  storeType: StoreTypeFilter;
  branch: BranchFilter;
}

export type CatalogSearchResult =
  | { kind: "found"; records: CatalogRecord[] }
  | { kind: "not_found"; suggestions: string[] };

export interface CatalogOverviewMetric {
  id: string;
  label: string;
  value: string;
  tone: CatalogSummaryTone;
}

export interface CatalogQuickQuery {
  label: string;
  query: string;
}

export const CATALOG_QUICK_QUERIES: CatalogQuickQuery[] = [
  { label: "Sneaker mới", query: "sneaker" },
  { label: "Tồn cần cập nhật", query: "stale" },
  { label: "Giá cần đối soát", query: "conflict" },
  { label: "CTKM cửa hàng", query: "khuyến mãi" },
  { label: "Barcode", query: "8936027" },
];

export const CATALOG_RECORDS: CatalogRecord[] = [
  {
    id: "catalog-sneaker-velocity",
    canonicalId: "PRD-000184",
    sku: "BQ-SNE-184",
    barcode: "8936027001848",
    name: "Sneaker Velocity",
    imageUrl: "/images/products/sneaker-velocity.jpg",
    category: "Giày sneaker nữ",
    collection: "Urban Ease",
    season: "Xuân Hè 2026",
    material: "Da tổng hợp + lót EVA",
    source: "SAP B1 + Haravan",
    syncedAt: "16/04/2026 - 10:12",
    projectionScope: "Sales-safe / Ecommerce",
    warningState: "none",
    ownerTeam: "Ecommerce / Catalog Ops",
    serviceNote:
      "Sản phẩm đang được đẩy mạnh trong bộ sưu tập mùa hè, thường được Sales hỏi cùng size 37-39.",
    description:
      "Mẫu sneaker nữ cổ thấp cho nhu cầu đi làm hằng ngày, phối tông trắng kem và đế nhẹ.",
    industry: "Giày dép nữ",
    stockPending: 12,
    stockAvailable: 145,
    stockActual: 157,
    vat: 10,
    syncStatus: "success",
    summaryItems: [
      { label: "Danh mục", value: "Sneaker nữ" },
      { label: "Bộ sưu tập", value: "Urban Ease" },
      { label: "Projection", value: "Ecommerce", tone: "success" },
      { label: "Biến thể active", value: "4 size / 2 màu" },
    ],
    attributes: [
      { label: "Chất liệu", value: "Da tổng hợp, lót EVA" },
      { label: "Đế", value: "Phylon siêu nhẹ" },
      { label: "Màu chủ đạo", value: "Trắng kem / Hồng phấn" },
      { label: "Tệp khách", value: "Nữ 22-35 tuổi" },
    ],
    variants: [
      {
        id: "velocity-37-cream",
        sku: "BQ-SNE-184-37-CRM",
        barcode: "8936027001849",
        color: "Kem",
        size: "37",
        availabilityLabel: "Còn hàng tốt",
      },
      {
        id: "velocity-38-cream",
        sku: "BQ-SNE-184-38-CRM",
        barcode: "8936027001850",
        color: "Kem",
        size: "38",
        availabilityLabel: "Còn hàng tốt",
      },
      {
        id: "velocity-39-pink",
        sku: "BQ-SNE-184-39-PNK",
        barcode: "8936027001851",
        color: "Hồng phấn",
        size: "39",
        availabilityLabel: "Còn giới hạn",
      },
    ],
    sourceTrace: [
      {
        system: "SAP B1",
        field: "Tên chuẩn / item master",
        value: "Sneaker Velocity",
        syncedAt: "16/04/2026 - 09:50",
      },
      {
        system: "Haravan",
        field: "Mô tả web / collection",
        value: "Urban Ease / sneaker nữ cổ thấp",
        syncedAt: "16/04/2026 - 10:12",
      },
      {
        system: "KiotViet",
        field: "Barcode POS",
        value: "8936027001848",
        syncedAt: "16/04/2026 - 09:42",
      },
    ],
    inventoryLocations: [
      {
        id: "velocity-online",
        name: "Kho online Tân Bình",
        branchId: "kho_tan_binh",
        channel: "ecommerce",
        storeType: "official",
        scopeLabel: "Kho online / ecommerce",
        availabilityLabel: "Còn hàng tốt",
        quantityLabel: "24 đôi khả dụng",
        freshnessLabel: "Realtime",
        source: "Haravan + SAP B1",
        syncedAt: "16/04/2026 - 10:10",
        warningState: "none",
        nextAction: "Có thể tư vấn giao nhanh nội thành trong ngày.",
      },
      {
        id: "velocity-q1",
        name: "BQ Flagship Q1",
        branchId: "flagship_q1",
        channel: "store",
        storeType: "official",
        scopeLabel: "Cửa hàng chính hãng",
        availabilityLabel: "Còn size 37-38",
        quantityLabel: "7 đôi bán được",
        freshnessLabel: "Cached 10 phút",
        source: "KiotViet",
        syncedAt: "16/04/2026 - 10:02",
        warningState: "none",
        nextAction: "Store có thể giữ size 38 trong 60 phút nếu khách cần thử.",
      },
    ],
    pricingContexts: [
      {
        id: "velocity-price-ecommerce",
        channel: "ecommerce",
        storeType: "official",
        contextLabel: "Website / ecommerce",
        basePrice: "1.290.000 đ",
        finalPrice: "1.090.000 đ",
        promotionLabel: "Giảm 200.000 đ bộ sưu tập Urban Ease",
        source: "SAP B1 + Haravan",
        syncedAt: "16/04/2026 - 09:58",
        warningState: "none",
        traceNote: "Giá cơ sở từ SAP B1, ưu đãi campaign online từ Haravan.",
      },
      {
        id: "velocity-price-store",
        channel: "store",
        storeType: "official",
        contextLabel: "Cửa hàng chính hãng",
        basePrice: "1.290.000 đ",
        finalPrice: "1.190.000 đ",
        promotionLabel: "Giảm 100.000 đ tại cửa hàng chính hãng",
        source: "SAP B1 + KiotViet",
        syncedAt: "16/04/2026 - 10:01",
        warningState: "none",
        traceNote: "CTKM tại cửa hàng chính hãng khác với online theo rule đã duyệt.",
      },
    ],
    promotions: [
      {
        id: "velocity-promo-summer",
        channel: "ecommerce",
        storeType: "official",
        name: "Summer Launch Urban Ease",
        discountLabel: "Giảm 200.000 đ",
        conditionLabel: "Áp dụng cho đơn từ 999.000 đ",
        scopeLabel: "Website / App BQ",
        validRange: "15/04 - 30/04/2026",
        source: "Haravan",
        publicSafeLabel: "Public-safe",
        warningState: "none",
        note: "Khách online nhìn thấy trực tiếp trên website.",
      },
      {
        id: "velocity-promo-store",
        channel: "store",
        storeType: "official",
        name: "Ưu đãi khai trương bộ sưu tập",
        discountLabel: "Giảm 100.000 đ",
        conditionLabel: "Áp dụng tại cửa hàng chính hãng",
        scopeLabel: "Store chính hãng",
        validRange: "16/04 - 25/04/2026",
        source: "KiotViet",
        publicSafeLabel: "Sales-safe",
        warningState: "none",
        note: "Store script có thể dùng để chốt khách tại quầy.",
      },
    ],
    unitsSold: 312,
    revenue: 339_840_000,
    topSellingColor: "Kem",
    topSellingSize: "38",
    relatedOrders: [
      { id: "ro-vel-1", orderCode: "HD-8821", customer: "Nguyễn Thị Mai", phone: "0912 345 678", color: "Kem", size: "38", qty: 1, value: 1_090_000, status: "Đã giao", channel: "Online", createdAt: "14/04/2026" },
      { id: "ro-vel-2", orderCode: "HD-8750", customer: "Trần Lan Anh", phone: "0987 654 321", color: "Hồng", size: "37", qty: 1, value: 1_090_000, status: "Đang giao", channel: "Cửa hàng", createdAt: "13/04/2026" },
      { id: "ro-vel-3", orderCode: "HD-8710", customer: "Lê Phương Thảo", phone: "0901 222 333", color: "Kem", size: "39", qty: 2, value: 2_180_000, status: "Đã giao", channel: "Online", createdAt: "12/04/2026" },
      { id: "ro-vel-4", orderCode: "HD-8680", customer: "Phan Thị Hà", phone: "0938 111 222", color: "Hồng", size: "38", qty: 1, value: 1_090_000, status: "Đã hủy", channel: "Online", createdAt: "10/04/2026" },
      { id: "ro-vel-5", orderCode: "HD-8630", customer: "Võ Minh Châu", phone: "0971 888 999", color: "Kem", size: "38", qty: 1, value: 1_090_000, status: "Đã giao", channel: "Cửa hàng", createdAt: "08/04/2026" },
    ],
    searchAliases: [
      "sneaker",
      "urban ease",
      "velocity",
      "giày trắng",
      "8936027001848",
      "ecommerce",
    ],
  },
  {
    id: "catalog-sandal-luna",
    canonicalId: "PRD-000205",
    sku: "BQ-SND-205",
    barcode: "8936027002050",
    name: "Sandal Luna Strap",
    imageUrl: "/images/products/sandal-luna.jpg",
    category: "Sandal nữ",
    collection: "Daily Breeze",
    season: "Xuân Hè 2026",
    material: "Da PU mềm",
    source: "SAP B1 + KiotViet",
    syncedAt: "15/04/2026 - 18:20",
    projectionScope: "Store / Sales-safe",
    warningState: "stale",
    ownerTeam: "Retail Ops",
    serviceNote:
      "Model này thường bị hỏi dồn vào cuối tuần, nhưng nguồn kho trung tâm cập nhật chậm hơn cửa hàng.",
    description:
      "Sandal quai mảnh cho nhu cầu đi phố, tập trung size 36-39 và màu kem, nâu sáng.",
    industry: "Giày dép nữ",
    stockPending: 5,
    stockAvailable: 38,
    stockActual: 43,
    vat: 10,
    syncStatus: "failed",
    summaryItems: [
      { label: "Danh mục", value: "Sandal nữ" },
      { label: "Bộ sưu tập", value: "Daily Breeze" },
      { label: "Độ mới dữ liệu", value: "Cần cập nhật", tone: "warning" },
      { label: "Biến thể active", value: "4 size / 2 màu" },
    ],
    attributes: [
      { label: "Chất liệu", value: "Da PU mềm, khóa hợp kim" },
      { label: "Màu chủ đạo", value: "Kem / Nâu sáng" },
      { label: "Độ cao đế", value: "3 cm" },
      { label: "Tệp khách", value: "Nữ văn phòng" },
    ],
    variants: [
      {
        id: "luna-36-cream",
        sku: "BQ-SND-205-36-CRM",
        barcode: "8936027002051",
        color: "Kem",
        size: "36",
        availabilityLabel: "Còn hàng giới hạn",
      },
      {
        id: "luna-37-cream",
        sku: "BQ-SND-205-37-CRM",
        barcode: "8936027002052",
        color: "Kem",
        size: "37",
        availabilityLabel: "Chờ cập nhật",
      },
    ],
    sourceTrace: [
      {
        system: "SAP B1",
        field: "Item master",
        value: "Sandal Luna Strap",
        syncedAt: "15/04/2026 - 18:20",
      },
      {
        system: "KiotViet",
        field: "Tồn tại cửa hàng",
        value: "Flagship Q1 / Vincom Thủ Đức",
        syncedAt: "16/04/2026 - 09:40",
      },
    ],
    inventoryLocations: [
      {
        id: "luna-q1",
        name: "BQ Flagship Q1",
        branchId: "flagship_q1",
        channel: "store",
        storeType: "official",
        scopeLabel: "Store chính hãng",
        availabilityLabel: "Còn hàng giới hạn",
        quantityLabel: "3 đôi bán được",
        freshnessLabel: "Cached 12 phút",
        source: "KiotViet",
        syncedAt: "16/04/2026 - 09:40",
        warningState: "none",
        nextAction: "Có thể chốt khách thử tại cửa hàng Q1.",
      },
      {
        id: "luna-dn",
        name: "Showroom Đà Nẵng",
        branchId: "showroom_da_nang",
        channel: "store",
        storeType: "official",
        scopeLabel: "Store khu vực miền Trung",
        availabilityLabel: "Chờ xác nhận",
        quantityLabel: "0 theo cache cũ",
        freshnessLabel: "Stale > 12 giờ",
        source: "SAP B1",
        syncedAt: "15/04/2026 - 18:20",
        warningState: "stale",
        nextAction: "Khuyến nghị kiểm tra lại realtime trước khi hứa chuyển hàng.",
      },
    ],
    pricingContexts: [
      {
        id: "luna-price-store",
        channel: "store",
        storeType: "official",
        contextLabel: "Cửa hàng chính hãng",
        basePrice: "890.000 đ",
        finalPrice: "890.000 đ",
        source: "SAP B1",
        syncedAt: "15/04/2026 - 18:20",
        warningState: "stale",
        traceNote: "Giá cơ sở chưa có overlay mới từ POS, cần đối chiếu nếu chạy mini-campaign cuối tuần.",
      },
    ],
    promotions: [
      {
        id: "luna-promo-store",
        channel: "store",
        storeType: "official",
        name: "Mua 2 đôi giảm 10%",
        discountLabel: "Giảm 10% đơn 2 đôi",
        conditionLabel: "Áp dụng nhóm sandal Daily Breeze",
        scopeLabel: "Store chính hãng",
        validRange: "10/04 - 20/04/2026",
        source: "SAP B1",
        publicSafeLabel: "Sales-safe",
        warningState: "stale",
        note: "Cần kiểm tra lại hiệu lực với Trade Marketing do campaign cuối tuần vừa gia hạn.",
      },
    ],
    unitsSold: 185,
    revenue: 166_500_000,
    topSellingColor: "Be",
    topSellingSize: "37",
    relatedOrders: [
      { id: "ro-luna-1", orderCode: "HD-8800", customer: "Hoàng Yến Nhi", phone: "0908 555 111", color: "Be", size: "37", qty: 1, value: 900_000, status: "Đã giao", channel: "Cửa hàng", createdAt: "15/04/2026" },
      { id: "ro-luna-2", orderCode: "HD-8771", customer: "Đỗ Thị Loan", phone: "0912 777 888", color: "Trắng", size: "36", qty: 1, value: 900_000, status: "Đang giao", channel: "Online", createdAt: "13/04/2026" },
      { id: "ro-luna-3", orderCode: "HD-8742", customer: "Ngô Bích Ngọc", phone: "0939 444 555", color: "Be", size: "38", qty: 2, value: 1_800_000, status: "Đã giao", channel: "Online", createdAt: "11/04/2026" },
    ],
    searchAliases: [
      "sandal",
      "daily breeze",
      "luna",
      "stale",
      "8936027002050",
      "cuối tuần",
    ],
  },
  {
    id: "catalog-loafer-heritage",
    canonicalId: "PRD-000229",
    sku: "BQ-LFR-229",
    barcode: "8936027002296",
    name: "Loafer Heritage",
    imageUrl: "/images/products/loafer-heritage.jpg",
    category: "Giày loafer nam",
    collection: "Boardroom Classic",
    season: "Bốn mùa",
    material: "Da bò thật",
    source: "SAP B1 + Haravan + KiotViet",
    syncedAt: "16/04/2026 - 10:36",
    projectionScope: "Ops / Pricing Control",
    warningState: "conflict",
    ownerTeam: "Pricing Control / Retail Ops",
    serviceNote:
      "Đang có tình huống hỏi giá chênh giữa website và store, cần giữ warning rõ để Sales không trả sai.",
    description:
      "Loafer nam da bò thật, form ôm chân, thường phục vụ nhóm khách công sở và đối tác doanh nghiệp.",
    industry: "Giày dép nam",
    stockPending: 0,
    stockAvailable: 72,
    stockActual: 72,
    vat: 10,
    syncStatus: "success",
    summaryItems: [
      { label: "Danh mục", value: "Loafer nam" },
      { label: "Bộ sưu tập", value: "Boardroom Classic" },
      { label: "Cảnh báo", value: "Cần đối soát giá", tone: "danger" },
      { label: "Biến thể active", value: "5 size / 1 màu" },
    ],
    attributes: [
      { label: "Chất liệu", value: "Da bò thật" },
      { label: "Màu chủ đạo", value: "Nâu đậm" },
      { label: "Tệp khách", value: "Nam công sở / khách doanh nghiệp" },
      { label: "Điểm mạnh", value: "Biên độ giá tốt, hay đi kèm CTKM quà tặng" },
    ],
    variants: [
      {
        id: "heritage-40-brown",
        sku: "BQ-LFR-229-40-BRN",
        barcode: "8936027002297",
        color: "Nâu đậm",
        size: "40",
        availabilityLabel: "Còn hàng",
      },
      {
        id: "heritage-41-brown",
        sku: "BQ-LFR-229-41-BRN",
        barcode: "8936027002298",
        color: "Nâu đậm",
        size: "41",
        availabilityLabel: "Còn hàng",
      },
    ],
    sourceTrace: [
      {
        system: "SAP B1",
        field: "Base price",
        value: "1.790.000 đ",
        syncedAt: "16/04/2026 - 09:55",
      },
      {
        system: "Haravan",
        field: "Giá hiển thị website",
        value: "1.590.000 đ",
        syncedAt: "16/04/2026 - 10:32",
      },
      {
        system: "KiotViet",
        field: "Giá tại POS",
        value: "1.690.000 đ",
        syncedAt: "16/04/2026 - 10:36",
      },
    ],
    inventoryLocations: [
      {
        id: "heritage-online",
        name: "Kho online Tân Bình",
        branchId: "kho_tan_binh",
        channel: "ecommerce",
        storeType: "official",
        scopeLabel: "Kho online",
        availabilityLabel: "Còn hàng tốt",
        quantityLabel: "16 đôi khả dụng",
        freshnessLabel: "Realtime",
        source: "Haravan",
        syncedAt: "16/04/2026 - 10:31",
        warningState: "none",
        nextAction: "Có thể upsell kèm belt da trong cùng bộ sưu tập.",
      },
      {
        id: "heritage-q1",
        name: "BQ Flagship Q1",
        branchId: "flagship_q1",
        channel: "store",
        storeType: "official",
        scopeLabel: "Store chính hãng",
        availabilityLabel: "Còn size 40-41",
        quantityLabel: "5 đôi bán được",
        freshnessLabel: "Cached 6 phút",
        source: "KiotViet",
        syncedAt: "16/04/2026 - 10:36",
        warningState: "none",
        nextAction: "Store có thể giữ hàng cho khách B2B đến thử trực tiếp.",
      },
    ],
    pricingContexts: [
      {
        id: "heritage-price-ecommerce",
        channel: "ecommerce",
        storeType: "official",
        contextLabel: "Website / ecommerce",
        basePrice: "1.790.000 đ",
        finalPrice: "1.590.000 đ",
        promotionLabel: "Voucher website 200.000 đ",
        source: "SAP B1 + Haravan",
        syncedAt: "16/04/2026 - 10:32",
        warningState: "conflict",
        traceNote: "Haravan đang thấp hơn POS 100.000 đ; cần xác nhận đây là campaign online hợp lệ.",
      },
      {
        id: "heritage-price-store",
        channel: "store",
        storeType: "official",
        contextLabel: "Cửa hàng chính hãng",
        basePrice: "1.790.000 đ",
        finalPrice: "1.690.000 đ",
        promotionLabel: "Ưu đãi store 100.000 đ",
        source: "SAP B1 + KiotViet",
        syncedAt: "16/04/2026 - 10:36",
        warningState: "conflict",
        traceNote: "Store giữ CTKM riêng, khác website; cần warning để Sales không gọi đây là một giá cuối cùng.",
      },
      {
        id: "heritage-price-dealer",
        channel: "dealer",
        storeType: "dealer",
        contextLabel: "Đại lý / đối tác",
        basePrice: "1.790.000 đ",
        finalPrice: "1.490.000 đ",
        source: "SAP B1",
        syncedAt: "16/04/2026 - 09:55",
        warningState: "restricted",
        traceNote: "Giá đại lý chỉ dành cho pricing control và kênh đối tác.",
      },
    ],
    promotions: [
      {
        id: "heritage-promo-web",
        channel: "ecommerce",
        storeType: "official",
        name: "Voucher website Heritage",
        discountLabel: "Giảm 200.000 đ",
        conditionLabel: "Nhập mã HERITAGE200",
        scopeLabel: "Website / app",
        validRange: "14/04 - 18/04/2026",
        source: "Haravan",
        publicSafeLabel: "Public-safe",
        warningState: "none",
        note: "Áp dụng đúng channel online, không dùng cho tại quầy.",
      },
      {
        id: "heritage-promo-dealer",
        channel: "dealer",
        storeType: "dealer",
        name: "Thưởng sell-through đại lý",
        discountLabel: "Giá net riêng theo đại lý",
        conditionLabel: "Áp dụng partner tier Bạc trở lên",
        scopeLabel: "Đại lý / đối tác",
        validRange: "01/04 - 30/04/2026",
        source: "SAP B1",
        publicSafeLabel: "Restricted",
        warningState: "restricted",
        note: "Không public-safe, chỉ dùng cho owner pricing và phát triển đại lý.",
      },
    ],
    unitsSold: 94,
    revenue: 223_360_000,
    topSellingColor: "Đen",
    topSellingSize: "40",
    relatedOrders: [
      { id: "ro-her-1", orderCode: "HD-8790", customer: "Trần Văn Bình", phone: "0902 333 444", color: "Đen", size: "40", qty: 1, value: 2_380_000, status: "Đã giao", channel: "Cửa hàng", createdAt: "15/04/2026" },
      { id: "ro-her-2", orderCode: "HD-8755", customer: "Lê Tuấn Anh", phone: "0913 666 777", color: "Nâu", size: "41", qty: 1, value: 2_380_000, status: "Đang giao", channel: "Đại lý", createdAt: "12/04/2026" },
      { id: "ro-her-3", orderCode: "HD-8710", customer: "Nguyễn Minh Hùng", phone: "0946 888 999", color: "Đen", size: "42", qty: 2, value: 4_760_000, status: "Đã giao", channel: "Online", createdAt: "09/04/2026" },
    ],
    searchAliases: [
      "loafer",
      "heritage",
      "conflict",
      "giá website",
      "giá store",
      "8936027002296",
      "đại lý",
    ],
  },
  {
    id: "catalog-heels-elegance",
    canonicalId: "PRD-000241",
    sku: "BQ-HEL-241",
    barcode: "8936027002418",
    name: "Elegance Heel",
    imageUrl: "/images/products/elegance-heel.jpg",
    category: "Giày cao gót",
    collection: "Evening Muse",
    season: "Xuân Hè 2026",
    material: "Da microfiber",
    source: "SAP B1 + Haravan",
    syncedAt: "16/04/2026 - 11:05",
    projectionScope: "Sales-safe / Store",
    warningState: "restricted",
    ownerTeam: "Trade Marketing / Store Ops",
    serviceNote:
      "Có CTKM riêng cho cửa hàng chính hãng và script tư vấn size, nhưng một phần campaign không nên lộ ngoài phạm vi.",
    description:
      "Giày cao gót basic cho nhu cầu dự tiệc và công sở, có sức bán tốt ở store chính hãng dịp cuối tuần.",
    industry: "Giày dép nữ",
    stockPending: 3,
    stockAvailable: 24,
    stockActual: 27,
    vat: 10,
    syncStatus: "syncing",
    summaryItems: [
      { label: "Danh mục", value: "Cao gót nữ" },
      { label: "Bộ sưu tập", value: "Evening Muse" },
      { label: "Projection", value: "Store / Sales-safe" },
      { label: "Cảnh báo", value: "Giới hạn quyền", tone: "warning" },
    ],
    attributes: [
      { label: "Chiều cao gót", value: "7 cm" },
      { label: "Chất liệu", value: "Da microfiber" },
      { label: "Màu chủ đạo", value: "Đen / Kem" },
      { label: "Nhu cầu", value: "Đi tiệc / đi làm" },
    ],
    variants: [
      {
        id: "elegance-37-black",
        sku: "BQ-HEL-241-37-BLK",
        barcode: "8936027002419",
        color: "Đen",
        size: "37",
        availabilityLabel: "Còn hàng",
      },
      {
        id: "elegance-38-cream",
        sku: "BQ-HEL-241-38-CRM",
        barcode: "8936027002420",
        color: "Kem",
        size: "38",
        availabilityLabel: "Còn hàng",
      },
    ],
    sourceTrace: [
      {
        system: "SAP B1",
        field: "Base price / store policy",
        value: "1.490.000 đ",
        syncedAt: "16/04/2026 - 10:50",
      },
      {
        system: "Haravan",
        field: "Mô tả web / campaign online",
        value: "Evening Muse weekend pick",
        syncedAt: "16/04/2026 - 11:05",
      },
    ],
    inventoryLocations: [
      {
        id: "elegance-thu-duc",
        name: "Vincom Thủ Đức",
        branchId: "vincom_thu_duc",
        channel: "store",
        storeType: "official",
        scopeLabel: "Store chính hãng",
        availabilityLabel: "Còn hàng tốt",
        quantityLabel: "9 đôi bán được",
        freshnessLabel: "Cached 5 phút",
        source: "KiotViet",
        syncedAt: "16/04/2026 - 10:58",
        warningState: "none",
        nextAction: "Có thể mời khách thử tại store nếu đang hỏi size 37-38.",
      },
    ],
    pricingContexts: [
      {
        id: "elegance-price-store",
        channel: "store",
        storeType: "official",
        contextLabel: "Cửa hàng chính hãng",
        basePrice: "1.490.000 đ",
        finalPrice: "1.340.000 đ",
        promotionLabel: "Ưu đãi store cuối tuần 150.000 đ",
        source: "SAP B1 + KiotViet",
        syncedAt: "16/04/2026 - 10:58",
        warningState: "none",
        traceNote: "CTKM tại quầy được phép dùng trong sales-safe mode.",
      },
      {
        id: "elegance-price-dealer",
        channel: "dealer",
        storeType: "dealer",
        contextLabel: "Đại lý / nhượng quyền",
        basePrice: "1.490.000 đ",
        finalPrice: "1.280.000 đ",
        source: "SAP B1",
        syncedAt: "16/04/2026 - 10:50",
        warningState: "restricted",
        traceNote: "Giá dành cho đại lý không hiển thị cho Sales thường.",
      },
    ],
    promotions: [
      {
        id: "elegance-promo-store",
        channel: "store",
        storeType: "official",
        name: "Weekend Heels Pick",
        discountLabel: "Giảm 150.000 đ",
        conditionLabel: "Áp dụng tại cửa hàng chính hãng",
        scopeLabel: "Store chính hãng",
        validRange: "16/04 - 21/04/2026",
        source: "KiotViet",
        publicSafeLabel: "Sales-safe",
        warningState: "none",
        note: "Store script được phép dùng trực tiếp khi tư vấn khách tại quầy.",
      },
      {
        id: "elegance-promo-partner",
        channel: "dealer",
        storeType: "dealer",
        name: "Thưởng trưng bày đại lý",
        discountLabel: "Net hỗ trợ riêng",
        conditionLabel: "Áp dụng theo partner agreement",
        scopeLabel: "Đại lý / nhượng quyền",
        validRange: "01/04 - 30/04/2026",
        source: "SAP B1",
        publicSafeLabel: "Restricted",
        warningState: "restricted",
        note: "Chỉ hiển thị cho nhóm pricing control và phát triển kênh.",
      },
    ],
    unitsSold: 67,
    revenue: 107_200_000,
    topSellingColor: "Đen",
    topSellingSize: "37",
    relatedOrders: [
      { id: "ro-ele-1", orderCode: "HD-8818", customer: "Phạm Thu Hương", phone: "0918 222 333", color: "Đen", size: "37", qty: 1, value: 1_600_000, status: "Đã giao", channel: "Cửa hàng", createdAt: "16/04/2026" },
      { id: "ro-ele-2", orderCode: "HD-8792", customer: "Bùi Khánh Linh", phone: "0928 444 666", color: "Nude", size: "38", qty: 1, value: 1_600_000, status: "Đang giao", channel: "Online", createdAt: "14/04/2026" },
      { id: "ro-ele-3", orderCode: "HD-8758", customer: "Lê Ngọc Anh", phone: "0941 777 888", color: "Đỏ", size: "36", qty: 1, value: 1_600_000, status: "Đã giao", channel: "Đại lý", createdAt: "11/04/2026" },
    ],
    searchAliases: [
      "heels",
      "cao gót",
      "weekend",
      "restricted",
      "8936027002418",
      "store",
    ],
  },
  {
    id: "catalog-bag-signature",
    canonicalId: "PRD-000312",
    sku: "BQ-BAG-312",
    barcode: "8936027003125",
    name: "Signature Crossbody",
    imageUrl: "/images/products/crossbody-bag.jpg",
    category: "Túi xách nữ",
    collection: "City Accent",
    season: "Quanh năm",
    material: "Da PU vân hạt",
    source: "SAP B1 + Haravan + KiotViet",
    syncedAt: "16/04/2026 - 09:24",
    projectionScope: "Sales-safe / Omnichannel",
    warningState: "needs_review",
    ownerTeam: "Omnichannel Ops",
    serviceNote:
      "Sản phẩm bán kèm tốt, nhưng tồn một số điểm bán bị lệch nhẹ nên cần note review khi khách hỏi gấp.",
    description:
      "Túi đeo chéo mini cho nhu cầu đi làm và đi chơi, thường được bán kèm với sneaker và loafer nữ.",
    industry: "Phụ kiện",
    stockPending: 8,
    stockAvailable: 56,
    stockActual: 64,
    vat: 10,
    syncStatus: "success",
    summaryItems: [
      { label: "Danh mục", value: "Túi xách nữ" },
      { label: "Bộ sưu tập", value: "City Accent" },
      { label: "Cảnh báo", value: "Cần review nhanh", tone: "warning" },
      { label: "Projection", value: "Omnichannel" },
    ],
    attributes: [
      { label: "Chất liệu", value: "Da PU vân hạt" },
      { label: "Màu chủ đạo", value: "Nâu / Kem" },
      { label: "Tệp khách", value: "Khách mua kèm phụ kiện" },
      { label: "Vai trò", value: "Sản phẩm upsell" },
    ],
    variants: [
      {
        id: "signature-brown",
        sku: "BQ-BAG-312-BRN",
        barcode: "8936027003126",
        color: "Nâu",
        size: "One size",
        availabilityLabel: "Còn hàng",
      },
    ],
    sourceTrace: [
      {
        system: "SAP B1",
        field: "Item master",
        value: "Signature Crossbody",
        syncedAt: "16/04/2026 - 09:05",
      },
      {
        system: "Haravan",
        field: "Collection ecommerce",
        value: "City Accent",
        syncedAt: "16/04/2026 - 09:24",
      },
    ],
    inventoryLocations: [
      {
        id: "signature-online",
        name: "Kho online Tân Bình",
        branchId: "kho_tan_binh",
        channel: "ecommerce",
        storeType: "official",
        scopeLabel: "Kho online",
        availabilityLabel: "Còn hàng",
        quantityLabel: "18 sản phẩm",
        freshnessLabel: "Cached 20 phút",
        source: "Haravan",
        syncedAt: "16/04/2026 - 09:24",
        warningState: "needs_review",
        nextAction: "Nếu khách hỏi giao gấp, nên xác nhận lại với kho online.",
      },
      {
        id: "signature-q1",
        name: "BQ Flagship Q1",
        branchId: "flagship_q1",
        channel: "store",
        storeType: "official",
        scopeLabel: "Store chính hãng",
        availabilityLabel: "Còn hàng",
        quantityLabel: "4 sản phẩm",
        freshnessLabel: "Cached 9 phút",
        source: "KiotViet",
        syncedAt: "16/04/2026 - 09:41",
        warningState: "none",
        nextAction: "Store có thể giữ hàng khi khách đã xác nhận set đồ mua kèm.",
      },
    ],
    pricingContexts: [
      {
        id: "signature-price-ecommerce",
        channel: "ecommerce",
        storeType: "official",
        contextLabel: "Website / ecommerce",
        basePrice: "790.000 đ",
        finalPrice: "690.000 đ",
        promotionLabel: "Combo phụ kiện giảm 100.000 đ",
        source: "SAP B1 + Haravan",
        syncedAt: "16/04/2026 - 09:24",
        warningState: "needs_review",
        traceNote: "Campaign combo còn active nhưng tồn online đang cần review để tránh oversell.",
      },
    ],
    promotions: [
      {
        id: "signature-promo-combo",
        channel: "ecommerce",
        storeType: "official",
        name: "Combo phụ kiện City Accent",
        discountLabel: "Giảm 100.000 đ",
        conditionLabel: "Mua kèm giày thuộc Urban Ease hoặc Boardroom Classic",
        scopeLabel: "Website / app",
        validRange: "12/04 - 20/04/2026",
        source: "Haravan",
        publicSafeLabel: "Public-safe",
        warningState: "none",
        note: "Campaign dùng để upsell trên online.",
      },
    ],
    unitsSold: 143,
    revenue: 257_400_000,
    topSellingColor: "Đen",
    topSellingSize: "—",
    relatedOrders: [
      { id: "ro-bag-1", orderCode: "HD-8815", customer: "Vũ Thị Lan", phone: "0905 111 222", color: "Đen", size: "—", qty: 1, value: 1_800_000, status: "Đã giao", channel: "Online", createdAt: "15/04/2026" },
      { id: "ro-bag-2", orderCode: "HD-8780", customer: "Hồ Bảo Châu", phone: "0929 333 444", color: "Kem", size: "—", qty: 2, value: 3_600_000, status: "Đã giao", channel: "Cửa hàng", createdAt: "13/04/2026" },
      { id: "ro-bag-3", orderCode: "HD-8745", customer: "Đinh Hải Yến", phone: "0942 555 666", color: "Đỏ đô", size: "—", qty: 1, value: 1_800_000, status: "Đang giao", channel: "Online", createdAt: "10/04/2026" },
      { id: "ro-bag-4", orderCode: "HD-8700", customer: "Lý Thị Phương", phone: "0963 777 888", color: "Đen", size: "—", qty: 1, value: 1_800_000, status: "Đã giao", channel: "Cửa hàng", createdAt: "06/04/2026" },
    ],
    searchAliases: [
      "bag",
      "túi",
      "combo",
      "city accent",
      "upsell",
      "8936027003125",
      "review",
    ],
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

function matchesChannel(record: CatalogRecord, channel: ChannelFilter) {
  if (channel === "all") {
    return true;
  }

  return (
    record.inventoryLocations.some((location) => location.channel === channel) ||
    record.pricingContexts.some((context) => context.channel === channel) ||
    record.promotions.some((promotion) => promotion.channel === channel)
  );
}

function matchesStoreType(record: CatalogRecord, storeType: StoreTypeFilter) {
  if (storeType === "all") {
    return true;
  }

  return (
    record.inventoryLocations.some((location) => location.storeType === storeType) ||
    record.pricingContexts.some((context) => context.storeType === storeType) ||
    record.promotions.some((promotion) => promotion.storeType === storeType)
  );
}

function matchesBranch(record: CatalogRecord, branch: BranchFilter) {
  if (branch === "all") {
    return true;
  }

  return record.inventoryLocations.some((location) => location.branchId === branch);
}

export function searchCatalog(
  filters: CatalogSearchFilters,
): CatalogSearchResult {
  const query = filters.query.trim();
  const normalizedQuery = normalize(query);

  const records = CATALOG_RECORDS.filter((record) => {
    const haystacks = [
      record.name,
      record.sku,
      record.barcode,
      record.category,
      record.collection,
      record.source,
      ...record.searchAliases,
      ...record.variants.map((variant) => variant.sku),
      ...record.variants.map((variant) => variant.barcode),
      ...record.promotions.map((promotion) => promotion.name),
    ];

    const matchesQuery =
      normalizedQuery.length === 0 ||
      haystacks.some((value) => normalize(value).includes(normalizedQuery));

    return (
      matchesQuery &&
      matchesChannel(record, filters.channel) &&
      matchesStoreType(record, filters.storeType) &&
      matchesBranch(record, filters.branch)
    );
  });

  if (records.length > 0) {
    return { kind: "found", records };
  }

  return {
    kind: "not_found",
    suggestions: [
      "Thử tìm theo SKU BQ-SNE-184",
      "Hoặc barcode 8936027002296",
      "Hoặc từ khóa Urban Ease / cao gót / khuyến mãi",
    ],
  };
}

export function getCatalogRecordById(id: string | null) {
  if (!id) {
    return null;
  }

  return CATALOG_RECORDS.find((record) => record.id === id) ?? null;
}

export function getCatalogOverviewMetrics(
  records: CatalogRecord[],
): CatalogOverviewMetric[] {
  const staleCount = records.filter((record) => record.warningState === "stale")
    .length;
  const conflictCount = records.filter(
    (record) =>
      record.warningState === "conflict" ||
      record.pricingContexts.some((context) => context.warningState === "conflict"),
  ).length;
  const promoCount = records.reduce((sum, record) => sum + record.promotions.length, 0);
  const reviewCount = records.filter(
    (record) =>
      record.warningState === "needs_review" ||
      record.inventoryLocations.some(
        (location) => location.warningState === "needs_review",
      ),
  ).length;

  return [
    {
      id: "products",
      label: "Sản phẩm đang hiển thị",
      value: records.length.toString(),
      tone: "default" as CatalogSummaryTone,
    },
    {
      id: "stale",
      label: "Nguồn cần cập nhật",
      value: staleCount.toString(),
      tone: staleCount > 0 ? "warning" : "default",
    },
    {
      id: "conflict",
      label: "Cần đối soát",
      value: conflictCount.toString(),
      tone: conflictCount > 0 ? "danger" : "default",
    },
    {
      id: "promotions",
      label: "CTKM active",
      value: promoCount.toString(),
      tone: promoCount > 0 ? "success" : "default",
    },
    {
      id: "review",
      label: "Cần review nhanh",
      value: reviewCount.toString(),
      tone: reviewCount > 0 ? "warning" : "default",
    },
  ];
}

export function getPrimaryInventory(
  record: CatalogRecord,
  filters: CatalogSearchFilters,
) {
  const exactBranch =
    filters.branch === "all"
      ? null
      : record.inventoryLocations.find((location) => location.branchId === filters.branch);

  if (exactBranch) {
    return exactBranch;
  }

  const channelMatch =
    filters.channel === "all"
      ? null
      : record.inventoryLocations.find((location) => location.channel === filters.channel);

  return channelMatch ?? record.inventoryLocations[0] ?? null;
}

export function getPrimaryPricing(
  record: CatalogRecord,
  filters: CatalogSearchFilters,
) {
  const exactMatch = record.pricingContexts.find(
    (context) =>
      (filters.channel === "all" || context.channel === filters.channel) &&
      (filters.storeType === "all" || context.storeType === filters.storeType),
  );

  return exactMatch ?? record.pricingContexts[0] ?? null;
}

export function getVisiblePromotions(
  record: CatalogRecord,
  filters: CatalogSearchFilters,
) {
  const filtered = record.promotions.filter(
    (promotion) =>
      (filters.channel === "all" || promotion.channel === filters.channel) &&
      (filters.storeType === "all" || promotion.storeType === filters.storeType),
  );

  return filtered.length > 0 ? filtered : record.promotions;
}
