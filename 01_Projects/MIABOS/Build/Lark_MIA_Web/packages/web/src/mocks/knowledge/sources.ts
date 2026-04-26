export type SourceType = "SAP B1" | "KiotViet" | "Excel";
export type SourceStatus = "Active" | "Stale" | "Conflict";

export interface DataSource {
  id: string;
  name: SourceType;
  description: string;
  lastSync: string;
  status: SourceStatus;
  docCount: number;
  syncFrequency: string;
}

const ONE_HOUR_AGO = new Date(Date.now() - 61 * 60 * 1000).toISOString();
const RECENT = new Date(Date.now() - 15 * 60 * 1000).toISOString();
const TWO_HOURS_AGO = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

export const DATA_SOURCES: DataSource[] = [
  {
    id: "src-001",
    name: "SAP B1",
    description: "Hệ thống ERP chính — giá, tồn kho, đơn hàng",
    lastSync: RECENT,
    status: "Active",
    docCount: 142,
    syncFrequency: "Mỗi 30 phút",
  },
  {
    id: "src-002",
    name: "KiotViet",
    description: "POS và bán lẻ — tồn kho cửa hàng, đơn bán lẻ",
    lastSync: ONE_HOUR_AGO,
    status: "Stale",
    docCount: 89,
    syncFrequency: "Mỗi 30 phút",
  },
  {
    id: "src-003",
    name: "Excel",
    description: "Upload thủ công — chính sách tạm thời, báo giá đặc biệt",
    lastSync: TWO_HOURS_AGO,
    status: "Stale",
    docCount: 23,
    syncFrequency: "Upload thủ công",
  },
];
