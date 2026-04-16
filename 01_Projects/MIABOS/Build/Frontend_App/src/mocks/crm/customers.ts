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
}

export const CUSTOMERS: Customer[] = [
  {
    id: "CRM-001",
    name: "Nguyễn Văn An",
    phone: "0901 234 567",
    email: "an.nguyen@gmail.com",
    status: "Customer",
    source: "Haravan",
    consentGiven: true,
    createdAt: "2025-11-10",
    lastContact: "2026-04-14",
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "42" },
      { key: "preferred_style", label: "Phong cách", value: "Thể thao" },
      { key: "branch_preference", label: "Chi nhánh", value: "BQ Tân Bình" },
    ],
    orders: [
      { id: "ORD-1001", date: "2026-04-10", channel: "Online", total: 1_250_000, status: "Delivered" },
      { id: "ORD-0892", date: "2026-03-15", channel: "POS", total: 890_000, status: "Delivered" },
      { id: "ORD-0754", date: "2026-01-20", channel: "Online", total: 2_100_000, status: "Delivered" },
    ],
    tags: ["VIP", "Thể thao"],
  },
  {
    id: "CRM-002",
    name: "Trần Thị Bích",
    phone: "0912 345 678",
    email: "bich.tran@yahoo.com",
    status: "Qualified",
    source: "KiotViet",
    consentGiven: true,
    createdAt: "2026-02-05",
    lastContact: "2026-04-12",
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "37" },
      { key: "preferred_style", label: "Phong cách", value: "Công sở" },
    ],
    orders: [
      { id: "ORD-0980", date: "2026-04-01", channel: "POS", total: 1_750_000, status: "Delivered" },
    ],
    tags: ["Công sở"],
  },
  {
    id: "CRM-003",
    name: "Lê Hoàng Minh",
    phone: "0938 456 789",
    email: "minh.le@outlook.com",
    status: "Lead",
    source: "Facebook",
    consentGiven: false,
    createdAt: "2026-04-13",
    lastContact: "2026-04-13",
    attributes: [],
    orders: [],
    tags: [],
  },
  {
    id: "CRM-004",
    name: "Phạm Thùy Dung",
    phone: "0976 567 890",
    email: "dung.pham@gmail.com",
    status: "Customer",
    source: "Zalo",
    consentGiven: true,
    createdAt: "2025-08-22",
    lastContact: "2026-04-10",
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "38" },
      { key: "preferred_style", label: "Phong cách", value: "Sandal" },
      { key: "branch_preference", label: "Chi nhánh", value: "BQ Quận 7" },
    ],
    orders: [
      { id: "ORD-1050", date: "2026-04-09", channel: "Online", total: 650_000, status: "Delivered" },
      { id: "ORD-0800", date: "2026-02-14", channel: "POS", total: 1_400_000, status: "Delivered" },
    ],
    tags: ["Remarketing"],
  },
  {
    id: "CRM-005",
    name: "Võ Quốc Hùng",
    phone: "0965 678 901",
    email: "",
    status: "Inactive",
    source: "SAP B1",
    consentGiven: true,
    createdAt: "2024-12-01",
    lastContact: "2025-06-15",
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "43" },
    ],
    orders: [
      { id: "ORD-0320", date: "2025-06-10", channel: "POS", total: 980_000, status: "Delivered" },
    ],
    tags: [],
  },
  {
    id: "CRM-006",
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
    tags: ["Fraud suspect"],
  },
  {
    id: "CRM-007",
    name: "Huỳnh Ngọc Lan",
    phone: "0923 890 123",
    email: "lan.huynh@gmail.com",
    status: "Lead",
    source: "Website",
    consentGiven: true,
    createdAt: "2026-04-15",
    lastContact: "2026-04-15",
    attributes: [
      { key: "preferred_style", label: "Phong cách", value: "Cao gót" },
    ],
    orders: [],
    tags: [],
  },
  {
    id: "CRM-008",
    name: "Bùi Thanh Hải",
    phone: "0945 901 234",
    email: "hai.bui@gmail.com",
    status: "Customer",
    source: "KiotViet",
    consentGiven: true,
    createdAt: "2025-10-15",
    lastContact: "2026-04-11",
    attributes: [
      { key: "shoe_size", label: "Size giày", value: "41" },
      { key: "preferred_style", label: "Phong cách", value: "Da nam" },
    ],
    orders: [
      { id: "ORD-1020", date: "2026-04-05", channel: "POS", total: 3_200_000, status: "Delivered" },
      { id: "ORD-0900", date: "2026-03-01", channel: "Online", total: 1_800_000, status: "Returned" },
    ],
    tags: ["VIP", "Da nam"],
  },
];
