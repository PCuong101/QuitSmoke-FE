import { Calendar, Award, Target, PiggyBank, Star, Sun, ShieldCheck } from 'lucide-react';

// Định nghĩa tất cả các thành tựu có thể có của ứng dụng
export const allAchievements = [
  // --- Hạng mục: Thời gian (Ngày cai thuốc) ---
  { id: 'time-1', category: 'time', title: 'Khởi Đầu Mới', description: 'Hoàn thành 1 ngày không hút thuốc.', milestone: 1, icon: Star, tier: 'bronze' },
  { id: 'time-2', category: 'time', title: 'Chiến Binh 3 Ngày', description: 'Cơ thể bạn đã sạch nicotine!', milestone: 3, icon: ShieldCheck, tier: 'bronze' },
  { id: 'time-3', category: 'time', title: 'Tuần Lễ Vàng', description: 'Vượt qua 7 ngày đầy thử thách.', milestone: 7, icon: Calendar, tier: 'silver' },
  { id: 'time-4', category: 'time', title: 'Nửa Chặng Đường', description: 'Kiên trì được 14 ngày.', milestone: 14, icon: Calendar, tier: 'silver' },
  { id: 'time-5', category: 'time', title: 'Một Tháng Kiên Trì', description: 'Xây dựng thói quen mới sau 30 ngày.', milestone: 30, icon: Award, tier: 'gold' },
  { id: 'time-6', category: 'time', title: '100 Ngày Tự Do', description: 'Cán mốc 100 ngày phi thường.', milestone: 100, icon: Sun, tier: 'gold' },

  // --- Hạng mục: Tiền tiết kiệm ---
  { id: 'money-1', category: 'money', title: 'Bữa Sáng Đầu Tiên', description: 'Tiết kiệm được 50,000 VNĐ.', milestone: 50000, icon: PiggyBank, tier: 'bronze' },
  { id: 'money-2', category: 'money', title: 'Nhà Đầu Tư Thông Thái', description: 'Tiết kiệm được 200,000 VNĐ.', milestone: 200000, icon: PiggyBank, tier: 'bronze' },
  { id: 'money-3', category: 'money', title: 'Triệu Phú Tương Lai', description: 'Tiết kiệm được 1,000,000 VNĐ.', milestone: 1000000, icon: PiggyBank, tier: 'silver' },
  { id: 'money-4', category: 'money', title: 'Quỹ Khẩn Cấp', description: 'Tiết kiệm được 5,000,000 VNĐ.', milestone: 5000000, icon: PiggyBank, tier: 'gold' },
  
  // --- Hạng mục: Nhiệm vụ ---
  { id: 'mission-1', category: 'mission', title: 'Nhập Môn', description: 'Hoàn thành 10 nhiệm vụ.', milestone: 10, icon: Target, tier: 'bronze' },
  { id: 'mission-2', category: 'mission', title: 'Siêng Năng', description: 'Hoàn thành 50 nhiệm vụ.', milestone: 50, icon: Target, tier: 'silver' },
  { id: 'mission-3', category: 'mission', title: 'Chuyên Gia Nhiệm Vụ', description: 'Hoàn thành 100 nhiệm vụ.', milestone: 100, icon: Target, tier: 'gold' },
  { id: 'mission-4', category: 'mission', title: 'Bậc Thầy Chinh Phục', description: 'Hoàn thành 250 nhiệm vụ.', milestone: 250, icon: Target, tier: 'gold' },
];