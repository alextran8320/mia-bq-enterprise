export type AvailabilityConfidence = "high" | "medium" | "low";
export type SalesAdvisorScenarioKind = "suggestion" | "lowConfidence" | "blocked" | "noMatch";

export interface DiscoveryStep {
  question: string;
  options: string[];
}

export interface ProductSuggestion {
  id: string;
  name: string;
  imageUrl: string;
  rationale: string;
  priceBand: string;
  promoNote?: string;
  availabilityConfidence: AvailabilityConfidence;
  availabilityLocation: string;
}

export interface SalesAdvisorScenario {
  kind: SalesAdvisorScenarioKind;
  userPrompt: string;
  assistantIntro: string;
  suggestions: ProductSuggestion[];
  ctaOptions: string[];
  warning?: string;
}

export const DISCOVERY_STEPS: DiscoveryStep[] = [
  {
    question: "Bạn muốn dùng giày cho dịp nào?",
    options: ["Đi làm", "Đi chơi", "Chạy bộ", "Đi học"],
  },
  {
    question: "Ngân sách bạn muốn tham khảo là khoảng nào?",
    options: ["Dưới 500k", "500k-1tr", "1tr-1.5tr", "Linh hoạt"],
  },
  {
    question: "Bạn ưu tiên cảm giác nào khi mang?",
    options: ["Êm chân", "Nhẹ", "Dễ phối đồ", "Bền"],
  },
];

export const SALES_ADVISOR_SCENARIOS: SalesAdvisorScenario[] = [
  {
    kind: "suggestion",
    userPrompt: "Tôi cần giày thể thao đi làm và đi chơi, ngân sách khoảng 1 triệu.",
    assistantIntro: "Dựa trên nhu cầu của bạn, đây là một số gợi ý phù hợp:",
    ctaOptions: ["Xem sản phẩm", "Để lại thông tin", "Hỏi câu khác"],
    suggestions: [
      {
        id: "bq-run-foam",
        name: "BQ Run Foam 3.0",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=240&q=80",
        rationale: "Đệm êm, dáng thể thao gọn và dễ phối với quần jeans hoặc đồ công sở casual.",
        priceBand: "Từ 890.000đ",
        promoNote: "Đang có ưu đãi 10% cho đơn online",
        availabilityConfidence: "high",
        availabilityLocation: "cửa hàng HCM",
      },
      {
        id: "bq-active-knit",
        name: "BQ Active Knit",
        imageUrl:
          "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=240&q=80",
        rationale: "Form nhẹ, thoáng chân, hợp khách cần một đôi đi lại hằng ngày.",
        priceBand: "Từ 760.000đ",
        availabilityConfidence: "medium",
        availabilityLocation: "khu vực miền Nam",
      },
    ],
  },
  {
    kind: "lowConfidence",
    userPrompt: "Tôi cần sandal nữ màu trắng, có thể ghé cửa hàng Đà Nẵng hôm nay.",
    assistantIntro: "Mình tìm thấy lựa chọn gần nhu cầu, nhưng tình trạng hàng cần được xác nhận thêm:",
    ctaOptions: ["Gặp nhân viên tư vấn", "Để lại thông tin", "Hỏi câu khác"],
    warning: "Tình trạng hàng có thể thay đổi theo cửa hàng. Bạn nên để nhân viên xác nhận trước khi đến.",
    suggestions: [
      {
        id: "bq-soft-sandal",
        name: "BQ Soft Sandal",
        imageUrl:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=240&q=80",
        rationale: "Thiết kế tối giản, dễ phối váy hoặc quần jeans, hợp nhu cầu đi lại nhẹ trong ngày.",
        priceBand: "Từ 520.000đ",
        availabilityConfidence: "low",
        availabilityLocation: "cửa hàng Đà Nẵng",
      },
    ],
  },
  {
    kind: "blocked",
    userPrompt: "Cho tôi biết tồn kho chính xác từng size và giá nhập nội bộ.",
    assistantIntro: "Mình không thể cung cấp thông tin này. Bạn có thể liên hệ nhân viên để được hỗ trợ nhé!",
    ctaOptions: ["Gặp nhân viên tư vấn", "Hỏi câu khác"],
    suggestions: [],
  },
  {
    kind: "noMatch",
    userPrompt: "Tôi cần một mẫu giới hạn đã ngừng bán từ nhiều năm trước.",
    assistantIntro: "Mình chưa tìm thấy sản phẩm phù hợp, nhưng bạn có thể xem thêm các lựa chọn gần nhu cầu.",
    ctaOptions: ["Xem thêm sản phẩm", "Để lại thông tin", "Hỏi câu khác"],
    suggestions: [],
  },
];

export function getAvailabilityCopy(suggestion: ProductSuggestion) {
  if (suggestion.availabilityConfidence === "high") {
    return `Còn hàng tại ${suggestion.availabilityLocation}`;
  }

  if (suggestion.availabilityConfidence === "medium") {
    return `Có thể còn tại ${suggestion.availabilityLocation}, nên xác nhận trước`;
  }

  return "Liên hệ cửa hàng để xác nhận tình trạng hàng";
}
