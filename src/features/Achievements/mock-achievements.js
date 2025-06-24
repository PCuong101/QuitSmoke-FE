import { Calendar, Award, Target, PiggyBank, Star, Sun, ShieldCheck, BookOpen } from 'lucide-react';

// Đây không còn là "mock" nữa, mà là một "Bảng tra cứu" cho Front-end.
// Nó bổ sung các thông tin (icon, tier, category) mà API không trả về.
export const allAchievements = [
  // --- Hạng mục: Thời gian (Ngày cai thuốc) ---
  { customLogicKey: 'FIRST_DAY',            category: 'time', title: 'Khởi Đầu Mới',        description: 'Hoàn thành 1 ngày không hút thuốc.',      icon: Star,         tier: 'bronze' },
  { customLogicKey: 'DAYS_QUIT_SMOKING_14',  category: 'time', title: 'Nửa Chặng Đường',     description: 'Kiên trì được 14 ngày.',                icon: Calendar,     tier: 'silver' },
  { customLogicKey: 'DAYS_QUIT_SMOKING_30',  category: 'time', title: 'Một Tháng Kiên Trì',    description: 'Xây dựng thói quen mới sau 30 ngày.',   icon: Award,        tier: 'gold' },
  
  // --- Hạng mục: Chuỗi ngày không hút (Streak) ---
  { customLogicKey: 'STREAK_NO_SMOKE_1',     category: 'time', title: 'Chiến Binh 1 Ngày',    description: 'Không hút điếu nào trong 24 giờ qua.',    icon: ShieldCheck,  tier: 'bronze' },
  { customLogicKey: 'STREAK_NO_SMOKE_7',     category: 'time', title: 'Tuần Lễ Vàng',         description: 'Vượt qua 7 ngày liên tục không hút thuốc.', icon: Calendar,     tier: 'silver' },
  { customLogicKey: 'STREAK_NO_SMOKE_30',    category: 'time', title: 'Bất Bại 30 Ngày',      description: 'Duy trì chuỗi 30 ngày không khói thuốc.',  icon: Sun,          tier: 'gold' },

  // --- Hạng mục: Tiền tiết kiệm ---
  { customLogicKey: 'MONEY_SAVED_100K',      category: 'money', title: 'Bữa Sáng Đầu Tiên',   description: 'Tiết kiệm được 100,000 VNĐ.',            icon: PiggyBank,    tier: 'bronze' },
  { customLogicKey: 'MONEY_SAVED_500K',      category: 'money', title: 'Nhà Đầu Tư Thông Thái', description: 'Tiết kiệm được 500,000 VNĐ.',           icon: PiggyBank,    tier: 'bronze' },
  { customLogicKey: 'MONEY_SAVED_1M',        category: 'money', title: 'Triệu Phú Tương Lai',  description: 'Tiết kiệm được 1,000,000 VNĐ.',         icon: PiggyBank,    tier: 'silver' },
  { customLogicKey: 'MONEY_SAVED_5M',        category: 'money', title: 'Quỹ Khẩn Cấp',         description: 'Tiết kiệm được 5,000,000 VNĐ.',         icon: PiggyBank,    tier: 'gold' },
  
  // --- Hạng mục: Nhật ký (Diary) ---
  { customLogicKey: 'NUMBER_OF_DIARY_1',     category: 'mission', title: 'Người Kể Chuyện',      description: 'Viết trang nhật ký đầu tiên.',          icon: BookOpen,     tier: 'bronze' },
  { customLogicKey: 'NUMBER_OF_DIARY_7',     category: 'mission', title: 'Nhà Văn Tập Sự',     description: 'Viết nhật ký trong 7 ngày.',           icon: BookOpen,     tier: 'silver' },
  { customLogicKey: 'NUMBER_OF_DIARY_30',    category: 'mission', title: 'Cuốn Sổ Vàng',       description: 'Duy trì viết nhật ký trong 30 ngày.',  icon: BookOpen,     tier: 'gold' },

  // Các thành tựu khác về Nhiệm vụ hoặc Sức khỏe có thể thêm vào đây
  // { customLogicKey: 'HEALTHY_MILESTONE_1_DAY', category: 'health', ... }
];