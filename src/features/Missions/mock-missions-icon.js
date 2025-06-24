import * as Icon from 'lucide-react';

const iconMap = {
  19: Icon.Brain,         // Chiến lược đối phó
  20: Icon.Target,        // Lập mục tiêu tuần
  21: Icon.Lotus,         // Tập yoga
  22: Icon.Coffee,        // Giảm cafein
  23: Icon.Walk,          // Đi bộ dài
  24: Icon.PenLine,       // Viết lại cam kết
  25: Icon.Phone,         // Gọi hỗ trợ
  26: Icon.Mic,           // Ghi âm cảm xúc
  27: Icon.HeartPulse     // Chăm sóc bản thân
};

export const getIconByTemplateId = (templateID) => {
  return iconMap[templateID] || Icon.Target; // fallback nếu không có icon
};
