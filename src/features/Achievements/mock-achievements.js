import { Calendar, Award, Target, PiggyBank, Star, Sun, ShieldCheck, BookOpen, HeartPulse } from 'lucide-react';

// Đây là "Bảng quy tắc & cấu hình" cho Front-end.
export const allAchievements = [
  // --- Tên và customLogicKey PHẢI KHỚP với DB ---
  // --- Mốc (milestone) PHẢI KHỚP với logic của BE ---

  // 1. MONEY SAVED (Loại: money)
  { customLogicKey: 'MONEY_SAVED_100K', category: 'money', title: 'Tiết kiệm 100 000 ₫', description: 'Bạn đã tránh tiêu 100 000 đồng nhờ không mua thuốc lá.', icon: PiggyBank, tier: 'bronze', milestone: 100000 },
  { customLogicKey: 'MONEY_SAVED_500K', category: 'money', title: 'Tiết kiệm 500 000 ₫', description: 'Bạn đã tránh tiêu 500 000 đồng kể từ khi bỏ thuốc.', icon: PiggyBank, tier: 'bronze', milestone: 500000 },
  { customLogicKey: 'MONEY_SAVED_1M',   category: 'money', title: 'Tiết kiệm 1 000 000 ₫', description: 'Bạn đã tránh tiêu 1 000 000 đồng kể từ khi bỏ thuốc.', icon: PiggyBank, tier: 'silver', milestone: 1000000 },
  { customLogicKey: 'MONEY_SAVED_5M',   category: 'money', title: 'Tiết kiệm 5 000 000 ₫', description: 'Bạn đã tránh tiêu 5 000 000 đồng kể từ khi bỏ thuốc.', icon: PiggyBank, tier: 'gold', milestone: 5000000 },

  // 2. DAYS QUIT SMOKING (Loại: time)
  { customLogicKey: 'DAYS_QUIT_SMOKING_14', category: 'time', title: '14 ngày bỏ thuốc', description: 'Bạn đã vượt mốc 14 ngày không hút thuốc – cố lên!', icon: Calendar, tier: 'silver', milestone: 14 },
  { customLogicKey: 'DAYS_QUIT_SMOKING_30', category: 'time', title: '30 ngày bỏ thuốc', description: 'Bạn đã bỏ thuốc tròn 30 ngày – tiếp tục duy trì nhé!', icon: Award, tier: 'gold', milestone: 30 },

  // 3. STREAK NO SMOKE (Loại: time)
  { customLogicKey: 'STREAK_NO_SMOKE_1',  category: 'time', title: 'Chuỗi 1 ngày sạch khói', description: 'Bạn vừa hoàn thành ngày đầu tiên không hút thuốc.', icon: ShieldCheck, tier: 'bronze', milestone: 1 },
  { customLogicKey: 'STREAK_NO_SMOKE_7',  category: 'time', title: 'Chuỗi 7 ngày sạch khói', description: 'Bạn đã không hút thuốc 7 ngày liên tục – tuyệt vời!', icon: ShieldCheck, tier: 'silver', milestone: 7 },
  { customLogicKey: 'STREAK_NO_SMOKE_30', category: 'time', title: 'Chuỗi 30 ngày sạch khói', description: 'Bạn đã duy trì 30 ngày liên tục không hút thuốc!', icon: Sun, tier: 'gold', milestone: 30 },

  // 4. FIRST DAY (Loại: time)
  { customLogicKey: 'FIRST_DAY', category: 'time', title: 'Ngày đầu thay đổi', description: 'Chúc mừng! Bạn đã khởi đầu hành trình bỏ thuốc.', icon: Star, tier: 'bronze', milestone: 1 },

  // 5. NUMBER OF DIARY (Loại: diary)
  { customLogicKey: 'NUMBER_OF_DIARY_1',  category: 'diary', title: 'Nhật ký đầu tiên',     description: 'Bạn đã ghi lại cảm xúc đầu tiên trong nhật ký bỏ thuốc.', icon: BookOpen, tier: 'bronze', milestone: 1 },
  { customLogicKey: 'NUMBER_OF_DIARY_7',  category: 'diary', title: '7 lượt nhập nhật ký',  description: 'Bạn đã viết 7 lần nhật ký – tiếp tục sẻ chia trải nghiệm!', icon: BookOpen, tier: 'silver', milestone: 7 },
  { customLogicKey: 'NUMBER_OF_DIARY_30', category: 'diary', title: '30 lượt nhập nhật ký', description: 'Bạn đã duy trì 30 lần ghi nhật ký – nỗ lực tuyệt vời!', icon: BookOpen, tier: 'gold', milestone: 30 },
  
  // 6. NUMBER OF TASK COMPLETE (Loại: mission)
  { customLogicKey: 'NUMBER_OF_TASK_COMPLETE_5',   category: 'mission', title: 'Hoàn thành 5 nhiệm vụ',   description: 'Bạn đã hoàn thành 5 nhiệm vụ – khởi đầu tốt đẹp!',             icon: Target, tier: 'bronze', milestone: 5 },
  { customLogicKey: 'NUMBER_OF_TASK_COMPLETE_10',  category: 'mission', title: 'Hoàn thành 10 nhiệm vụ',  description: 'Bạn đã hoàn thành 10 nhiệm vụ – tiếp tục phát huy!',           icon: Target, tier: 'bronze', milestone: 10 },
  { customLogicKey: 'NUMBER_OF_TASK_COMPLETE_20',  category: 'mission', title: 'Hoàn thành 20 nhiệm vụ',  description: 'Bạn đã hoàn thành 20 nhiệm vụ – bạn đang đi đúng hướng!',     icon: Target, tier: 'silver', milestone: 20 },
  { customLogicKey: 'NUMBER_OF_TASK_COMPLETE_30',  category: 'mission', title: 'Hoàn thành 30 nhiệm vụ',  description: 'Bạn đã hoàn thành 30 nhiệm vụ – sự kiên trì đang mang lại kết quả!', icon: Target, tier: 'silver', milestone: 30 },
  { customLogicKey: 'NUMBER_OF_TASK_COMPLETE_50',  category: 'mission', title: 'Hoàn thành 50 nhiệm vụ',  description: 'Bạn đã hoàn thành 50 nhiệm vụ – một thành tích đáng tự hào!',  icon: Target, tier: 'gold', milestone: 50 },
  { customLogicKey: 'NUMBER_OF_TASK_COMPLETE_100', category: 'mission', title: 'Hoàn thành 100 nhiệm vụ', description: 'Bạn đã hoàn thành 100 nhiệm vụ – bạn là người cực kỳ kiên định!', icon: Target, tier: 'gold', milestone: 100 },
];