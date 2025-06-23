import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar"
import { allAchievements } from "./mock-achievements"; // Import dữ liệu
import { Share2, Lock } from 'lucide-react';

// --- DỮ LIỆU MẪU MỚI: LỊCH SỬ THÀNH TỰU CỦA NGƯỜI DÙNG ---
// Sau này, bạn sẽ lấy danh sách này từ API. Mỗi object chứa ID của thành tựu và ngày đạt được.
const userUnlockedAchievements = [
  { id: 'time-1', date: '20/07/2024' },
  { id: 'time-2', date: '22/07/2024' },
  { id: 'time-3', date: '26/07/2024' },
  { id: 'time-4', date: '02/08/2024' },
  { id: 'time-5', date: '18/08/2024' },
  
  { id: 'money-1', date: '22/07/2024' },
  { id: 'money-2', date: '29/07/2024' },
  { id: 'money-3', date: '15/08/2024' },

  { id: 'mission-1', date: '25/07/2024' },
  { id: 'mission-2', date: '10/08/2024' },
];

// Component con để hiển thị một huy hiệu (ĐÃ ĐƯỢC CẬP NHẬT)
function AchievementBadge({ achievement, unlockedData }) {
  const Icon = achievement.icon;
  const isUnlocked = !!unlockedData; // Nếu có unlockedData -> true, ngược lại -> false

  return (
    <div className={`achievement-badge ${isUnlocked ? `unlocked tier-${achievement.tier}` : 'locked'}`}>
      <div className="badge-icon-wrapper">
        {/* Nếu khóa thì hiện icon Khóa, nếu mở thì hiện icon thành tựu */}
        {isUnlocked ? <Icon size={48} className="main-badge-icon" /> : <Lock size={48} className="main-badge-icon" />}
      </div>
      <div className="badge-text">
        <h4 className="badge-title">{achievement.title}</h4>
        <p className="badge-description">{achievement.description}</p>
        
        {/* --- THÊM DÒNG HIỂN THỊ NGÀY ĐẠT ĐƯỢC --- */}
        {isUnlocked && (
          <p className="badge-unlocked-date">
            Đạt được ngày: {unlockedData.date}
          </p>
        )}
      </div>
      {isUnlocked && (
        <button className="share-badge-button" title="Chia sẻ thành tựu">
          <Share2 size={18} />
        </button>
      )}
    </div>
  );
}

function Achievement() {
  const timeAchievements = allAchievements.filter(a => a.category === 'time');
  const moneyAchievements = allAchievements.filter(a => a.category === 'money');
  const missionAchievements = allAchievements.filter(a => a.category === 'mission');

  return (
    <>
      <NavBar />
      <div className="achievement-page">
        <header className="achievement-header">
          <h1>Bộ Sưu Tập Thành Tựu</h1>
          <p>Mỗi huy hiệu là một minh chứng cho sự kiên trì và nỗ lực phi thường của bạn!</p>
        </header>

        {/* --- Các hạng mục đã được cập nhật logic --- */}
        <section className="achievement-category">
          <h2>Cột Mốc Thời Gian</h2>
          <div className="achievement-grid">
            {timeAchievements.map(ach => {
              const unlockedData = userUnlockedAchievements.find(unlocked => unlocked.id === ach.id);
              return <AchievementBadge 
                key={ach.id} 
                achievement={ach} 
                unlockedData={unlockedData} 
              />
            })}
          </div>
        </section>

        <section className="achievement-category">
          <h2>Tiết Kiệm Tài Chính</h2>
          <div className="achievement-grid">
            {moneyAchievements.map(ach => {
              const unlockedData = userUnlockedAchievements.find(unlocked => unlocked.id === ach.id);
              return <AchievementBadge 
                key={ach.id} 
                achievement={ach} 
                unlockedData={unlockedData} 
              />
            })}
          </div>
        </section>

        <section className="achievement-category">
          <h2>Chinh Phục Nhiệm Vụ</h2>
          <div className="achievement-grid">
            {missionAchievements.map(ach => {
              const unlockedData = userUnlockedAchievements.find(unlocked => unlocked.id === ach.id);
              return <AchievementBadge 
                key={ach.id} 
                achievement={ach} 
                unlockedData={unlockedData} 
              />
            })}
          </div>
        </section>
        
      </div>
      <Footer></Footer>
    </>
  );
}

export default Achievement;