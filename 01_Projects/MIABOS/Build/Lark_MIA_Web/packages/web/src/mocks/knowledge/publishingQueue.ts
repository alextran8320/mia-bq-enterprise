export interface QueueItem {
  id: string;
  docTitle: string;
  docType: string;
  domain: string;
  submittedBy: string;
  submittedAt: string;
  slaStatus: "urgent" | "normal";
  changeType: "new" | "update";
  body: string;
}

export const PUBLISHING_QUEUE: QueueItem[] = [
  {
    id: "q-001",
    docTitle: "Quy định chiết khấu khách hàng thân thiết",
    docType: "Policy",
    domain: "Giá bán",
    submittedBy: "Lê Thu Hương",
    submittedAt: "2026-04-17T07:00:00",
    slaStatus: "urgent",
    changeType: "new",
    body: "Hạng Bạc: 5%. Hạng Vàng: 8%. Hạng Kim Cương: 12% + ưu tiên hàng mới.",
  },
  {
    id: "q-002",
    docTitle: "FAQ: Chính sách đổi size cho giày thể thao",
    docType: "FAQ",
    domain: "Đổi trả",
    submittedBy: "Trần Minh Khoa",
    submittedAt: "2026-04-17T09:30:00",
    slaStatus: "normal",
    changeType: "new",
    body: "H: Có thể đổi size trong bao nhiêu ngày?\nA: 7 ngày từ ngày mua, sản phẩm chưa qua sử dụng.",
  },
  {
    id: "q-003",
    docTitle: "Hướng dẫn sử dụng máy đo chân điện tử",
    docType: "System Guide",
    domain: "Vận hành",
    submittedBy: "Phạm Đức Thắng",
    submittedAt: "2026-04-16T15:00:00",
    slaStatus: "normal",
    changeType: "update",
    body: "Cập nhật: thêm hướng dẫn hiệu chỉnh cảm biến sau 30 ngày sử dụng.",
  },
];
