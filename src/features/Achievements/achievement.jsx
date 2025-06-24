import { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import { allAchievements } from "./mock-achievements"; // Import "bảng tra cứu"
import { Share2, Lock, LoaderCircle } from 'lucide-react';
import useUserId from "../../hooks/useUserId"; // Dùng lại hook để lấy userId

// --- CÁC THÀNH PHẦN PHỤ ---

// Hàm helper để format ngày tháng
function formatAchievedDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

// Component hiển thị một huy hiệu
function AchievementBadge({ achievementInfo, unlockedData }) {
  // achievementInfo: Dữ liệu từ bảng tra cứu (chứa icon, tier...)
  // unlockedData: Dữ liệu từ API (chứa ngày đạt được...)
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


// --- COMPONENT CHÍNH ---

function Achievement() {
  const userId = useUserId();
  const [userAchievementsMap, setUserAchievementsMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Chỉ chạy khi đã có userId
    if (userId) {
      const fetchAndProcessAchievements = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/api/achievements/${userId}`);
          if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
          
          const unlockedDtos = await response.json(); // Đây là List<AchievementDTO>
          
          // Chuyển List<AchievementDTO> thành một Map để tra cứu nhanh
          // Key của Map là `title` của thành tựu (vì đây là trường duy nhất có thể khớp)
          const unlockedMap = new Map();
          for (const dto of unlockedDtos) {
            unlockedMap.set(dto.name, dto);
          }
          setUserAchievementsMap(unlockedMap);

        } catch (error) {
          console.error("Lỗi khi fetch thành tựu:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAndProcessAchievements();
    } else {
        // Nếu không có userId, vẫn dừng loading sau một khoảng thời gian
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [userId]);

  // Phân loại các thành tựu dựa trên "bảng tra cứu" allAchievements
  const achievementsByCategory = {
    time: allAchievements.filter(a => a.category === 'time' || a.category === 'health'),
    money: allAchievements.filter(a => a.category === 'money'),
    mission: allAchievements.filter(a => a.category === 'mission'),
  };

  // Giao diện khi đang tải
  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="loading-container" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <LoaderCircle className="spinner" size={48} />
          <p style={{ marginTop: '16px', fontSize: '18px', color: '#6b7280' }}>Đang tải thành tựu...</p>
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
          <h2>Cột Mốc & Sức Khỏe</h2>
          <div className="achievement-grid">
            {achievementsByCategory.time.map(achTemplate => {
              // Lấy dữ liệu đã mở khóa từ map, dựa trên title
              const unlockedData = userAchievementsMap.get(achTemplate.title);
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
            {achievementsByCategory.money.map(achTemplate => {
              const unlockedData = userAchievementsMap.get(achTemplate.title);
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
            {achievementsByCategory.mission.map(achTemplate => {
              const unlockedData = userAchievementsMap.get(achTemplate.title);
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