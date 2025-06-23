import { Wind, Footprints, Droplets, BookOpen, Smile, BrainCircuit, Dumbbell, Phone } from 'lucide-react';

// Mô phỏng bảng TaskTemplates từ DB - Thêm nhiều nhiệm vụ hơn để có thể chọn ngẫu nhiên
export const mockTaskTemplates = [
  { templateId: 1, title: 'Hít thở sâu 5 phút', description: 'Tìm nơi yên tĩnh, tập trung vào hơi thở. Hít vào bằng mũi, giữ 3 giây, thở ra từ từ bằng miệng.', icon: Wind },
  { templateId: 2, title: 'Đi dạo 15 phút', description: 'Vận động nhẹ giúp giảm căng thẳng và cơn thèm thuốc.', icon: Footprints },
  { templateId: 3, title: 'Uống một ly nước lớn', description: 'Khi thèm thuốc, uống ngay một ly nước đầy để thanh lọc cơ thể.', icon: Droplets },
  { templateId: 4, title: 'Đọc một chương sách', description: 'Đánh lạc hướng tâm trí bằng cách đắm mình vào một câu chuyện.', icon: BookOpen },
  { templateId: 5, title: 'Viết ra 3 điều bạn biết ơn', description: 'Tập trung vào những điều tích cực để cải thiện tâm trạng.', icon: Smile },
  { templateId: 6, title: 'Giải một câu đố Sudoku', description: 'Thử thách bộ não giúp bạn tập trung và quên đi cơn thèm thuốc.', icon: BrainCircuit },
  { templateId: 7, title: 'Tập thể dục nhẹ 10 phút', description: 'Thực hiện vài động tác giãn cơ hoặc yoga đơn giản tại nhà.', icon: Dumbbell },
  { templateId: 8, title: 'Gọi điện cho người thân', description: 'Chia sẻ cảm xúc với người bạn tin tưởng giúp giảm bớt căng thẳng.', icon: Phone },
  // Thêm các template khác nếu cần
];

// Mô phỏng bảng TaskCompletions của người dùng hiện tại
// Đây là những nhiệm vụ người dùng ĐÃ hoàn thành
export const mockUserCompletions = [
  { completionId: 101, templateId: 1, completedAt: '2024-08-25T10:00:00Z' },
  { completionId: 102, templateId: 7, completedAt: '2024-08-26T15:30:00Z' },
  { completionId: 103, templateId: 3, completedAt: '2024-08-27T09:15:00Z' },
];

// --- CẬP NHẬT QUAN TRỌNG ---
// Mô phỏng danh sách 5 nhiệm vụ được gợi ý cho ngày hôm nay.
// Trong thực tế, backend sẽ trả về danh sách này.
export const mockTodayMissionList = [
    mockTaskTemplates[0], // Hít thở sâu
    mockTaskTemplates[2], // Uống nước
    mockTaskTemplates[4], // Viết 3 điều biết ơn
    mockTaskTemplates[6], // Tập thể dục
    mockTaskTemplates[1], // Đi dạo
];