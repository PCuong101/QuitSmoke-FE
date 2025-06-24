import { Calendar, Award, Target, PiggyBank, Star, Sun, ShieldCheck, BookOpen, HeartPulse } from 'lucide-react';

// Bảng tra cứu cho Front-end để bổ sung thông tin (icon, tier, category) mà API không trả về.
export const allAchievements = [
  // --- Tên và customLogicKey PHẢI KHỚP với DB ---

  // 1. MONEY SAVED
  { customLogicKey: 'MONEY_SAVED_100K', category: 'money', title: 'Tiết kiệm 100 000 ₫', description: 'Bạn đã tránh tiêu 100 000 đồng nhờ không mua thuốc lá.', icon: PiggyBank, tier: 'bronze' },
  { customLogicKey: 'MONEY_SAVED_500K', category: 'money', title: 'Tiết kiệm 500 000 ₫', description: 'Bạn đã tránh tiêu 500 000 đồng kể từ khi bỏ thuốc.', icon: PiggyBank, tier: 'bronze' },
  { customLogicKey: 'MONEY_SAVED_1M',   category: 'money', title: 'Tiết kiệm 1 000 000 ₫', description: 'Bạn đã tránh tiêu 1 000 000 đồng kể từ khi bỏ thuốc.', icon: PiggyBank, tier: 'silver' },
  { customLogicKey: 'MONEY_SAVED_5M',   category: 'money', title: 'Tiết kiệm 5 000 000 ₫', description: 'Bạn đã tránh tiêu 5 000 000 đồng kể từ khi bỏ thuốc.', icon: PiggyBank, tier: 'gold' },

  // 2. DAYS QUIT SMOKING
  { customLogicKey: 'DAYS_QUIT_SMOKING_14', category: 'time', title: '14 ngày bỏ thuốc', description: 'Bạn đã vượt mốc 14 ngày không hút thuốc – cố lên!', icon: Calendar, tier: 'silver' },
  { customLogicKey: 'DAYS_QUIT_SMOKING_30', category: 'time', title: '30 ngày bỏ thuốc', description: 'Bạn đã bỏ thuốc tròn 30 ngày – tiếp tục duy trì nhé!', icon: Award, tier: 'gold' },

  // 3. STREAK NO SMOKE
  { customLogicKey: 'STREAK_NO_SMOKE_1',  category: 'time', title: 'Chuỗi 1 ngày sạch khói', description: 'Bạn vừa hoàn thành ngày đầu tiên không hút thuốc.', icon: ShieldCheck, tier: 'bronze' },
  { customLogicKey: 'STREAK_NO_SMOKE_7',  category: 'time', title: 'Chuỗi 7 ngày sạch khói', description: 'Bạn đã không hút thuốc 7 ngày liên tục – tuyệt vời!', icon: ShieldCheck, tier: 'silver' },
  { customLogicKey: 'STREAK_NO_SMOKE_30', category: 'time', title: 'Chuỗi 30 ngày sạch khói', description: 'Bạn đã duy trì 30 ngày liên tục không hút thuốc!', icon: Sun, tier: 'gold' },

  // 4. FIRST DAY
  { customLogicKey: 'FIRST_DAY', category: 'time', title: 'Ngày đầu thay đổi', description: 'Chúc mừng! Bạn đã khởi đầu hành trình bỏ thuốc.', icon: Star, tier: 'bronze' },

  // 5. NUMBER OF DIARY
  { customLogicKey: 'NUMBER_OF_DIARY_1',  category: 'mission', title: 'Nhật ký đầu tiên',     description: 'Bạn đã ghi lại cảm xúc đầu tiên trong nhật ký bỏ thuốc.', icon: BookOpen, tier: 'bronze' },
  { customLogicKey: 'NUMBER_OF_DIARY_7',  category: 'mission', title: '7 lượt nhập nhật ký',  description: 'Bạn đã viết 7 lần nhật ký – tiếp tục sẻ chia trải nghiệm!', icon: BookOpen, tier: 'silver' },
  { customLogicKey: 'NUMBER_OF_DIARY_30', category: 'mission', title: '30 lượt nhập nhật ký', description: 'Bạn đã duy trì 30 lần ghi nhật ký – nỗ lực tuyệt vời!', icon: BookOpen, tier: 'gold' },

  // 6. HEALTHY MILESTONE (Thêm một vài ví dụ)
  { customLogicKey: 'HEALTHY_MILESTONE_20_MIN', category: 'health', title: 'Phục hồi sau 20 phút', description: 'Huyết áp và nhịp tim của bạn đã trở lại bình thường.', icon: HeartPulse, tier: 'bronze' },
  { customLogicKey: 'HEALTHY_MILESTONE_8_HOURS',  category: 'health', title: 'Phục hồi sau 8 giờ',  description: 'Mức carbon monoxide trong máu giảm, oxy tăng lên.', icon: HeartPulse, tier: 'bronze' },
  { customLogicKey: 'HEALTHY_MILESTONE_1_DAY',  category: 'health', title: 'Phục hồi sau 1 ngày',  description: 'Nguy cơ nhồi máu cơ tim bắt đầu giảm.', icon: HeartPulse, tier: 'bronze' },
  // ... bạn có thể thêm các mốc sức khỏe khác vào đây ...
];