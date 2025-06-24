import { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import { allAchievements } from "./mock-achievements"; // Import bảng tra cứu
import { Share2, Lock, LoaderCircle } from 'lucide-react';
import useUserId from "../../hooks/useUserId";

// Hàm helper để format ngày
function formatAchievedDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Component con để hiển thị một huy hiệu
function AchievementBadge({ achievementInfo, unlockedData }) {
  const Icon = achievementInfo.icon;
  const isUnlocked = !!unlockedData;

  return (
    <div className={`achievement-badge ${isUnlocked ? `unlocked tier-${achievementInfo.tier}` : 'locked'}`}>
      <div className="badge-icon-wrapper">
        {isUnlocked ? <Icon size={48} className="main-badge-icon" /> : <Lock size={48} className="main-badge-icon" />}
      </div>
      <div className="badge-text">
        <h4 className="badge-title">{achievementInfo.title}</h4>
        <p className="badge-description">{achievementInfo.description}</p>
        
        {isUnlocked && (
          <p className="badge-unlocked-date">
            Đạt được ngày: {formatAchievedDate(unlockedData.achievedAt)}
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
  const userId = useUserId();
  const [userAchievements, setUserAchievements] = useState([]); // Lưu trữ dữ liệu từ API
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchUserAchievements = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/api/achievements/${userId}`);
          if (!response.ok) {
            throw new Error(`Lỗi khi lấy thành tựu: ${response.status}`);
          }
          const dataFromApi = await response.json(); // Đây là mảng AchievementDTO
          
          // Tạo một map để tra cứu nhanh các thành tựu đã mở khóa
          const unlockedMap = new Map();
          dataFromApi.forEach(dto => {
            // Tìm template tương ứng trong bảng tra cứu allAchievements
            const template = allAchievements.find(t => t.title === dto.name); // Khớp qua title
            if (template) {
              // Key là customLogicKey, value là toàn bộ object DTO
              unlockedMap.set(template.customLogicKey, dto);
            }
          });

          setUserAchievements(unlockedMap); // Lưu lại map này vào state
        } catch (error) {
          console.error("Fetch user achievements error:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserAchievements();
    } else {
        // Nếu không có userId sau một khoảng thời gian, dừng loading
        const timer = setTimeout(() => {
            if(!userId) setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [userId]);

  // Phân loại dựa trên bảng tra cứu `allAchievements`
  const timeAchievements = allAchievements.filter(a => a.category === 'time');
  const moneyAchievements = allAchievements.filter(a => a.category === 'money');
  const missionAchievements = allAchievements.filter(a => a.category === 'mission');

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="loading-container" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <LoaderCircle className="spinner" size={48} />
          <p style={{ marginTop: '16px', fontSize: '18px', color: '#6b7280' }}>Đang tải thành tựu của bạn...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="achievement-page">
        <header className="achievement-header">
          <h1>Bộ Sưu Tập Thành Tựu</h1>
          <p>Mỗi huy hiệu là một minh chứng cho sự kiên trì và nỗ lực phi thường của bạn!</p>
        </header>

        {/* --- Render các hạng mục --- */}
        <section className="achievement-category">
          <h2>Cột Mốc & Chuỗi Ngày</h2>
          <div className="achievement-grid">
            {timeAchievements.map(achTemplate => {
              // Lấy dữ liệu đã mở khóa từ map, dựa trên customLogicKey
              const unlockedData = userAchievements.get(achTemplate.customLogicKey);
              return <AchievementBadge 
                key={achTemplate.customLogicKey} 
                achievementInfo={achTemplate} // Truyền toàn bộ thông tin từ bảng tra cứu
                unlockedData={unlockedData}   // Truyền dữ liệu từ API (nếu có)
              />
            })}
          </div>
        </section>

        <section className="achievement-category">
          <h2>Tiết Kiệm Tài Chính</h2>
          <div className="achievement-grid">
            {moneyAchievements.map(achTemplate => {
              const unlockedData = userAchievements.get(achTemplate.customLogicKey);
              return <AchievementBadge 
                key={achTemplate.customLogicKey} 
                achievementInfo={achTemplate}
                unlockedData={unlockedData}
              />
            })}
          </div>
        </section>

        <section className="achievement-category">
          <h2>Nhật Ký & Nhiệm Vụ</h2>
          <div className="achievement-grid">
            {missionAchievements.map(achTemplate => {
              const unlockedData = userAchievements.get(achTemplate.customLogicKey);
              return <AchievementBadge 
                key={achTemplate.customLogicKey} 
                achievementInfo={achTemplate} 
                unlockedData={unlockedData}
              />
            })}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Achievement;