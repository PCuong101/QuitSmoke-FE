import { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import { allAchievements } from "./mock-achievements";
import { Share2, Lock, LoaderCircle } from 'lucide-react';
import useUserId from "../../hooks/useUserId";
import './achievement.css';
import { useNotifications } from '../../contexts/NotificationContext.jsx';

// --- CÁC THÀNH PHẦN PHỤ (Không thay đổi) ---
function formatAchievedDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

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

// --- COMPONENT CHÍNH ĐÃ ĐƯỢC VIẾT LẠI LOGIC ---
function Achievement() {
  const userId = useUserId();
  const [userAchievementsMap, setUserAchievementsMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const { addAchievementNotification } = useNotifications();

  useEffect(() => {
    if (userId) {
      const fetchAndProcessAchievements = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/api/achievements/${userId}`);
          if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
          
          const unlockedDtos = await response.json(); // Dữ liệu từ API
          
          // === LOGIC PHÁT HIỆN THÀNH TỰU MỚI ===

          // 1. Lấy số lượng thành tựu đã biết từ localStorage
          const knownAchievementsKey = `known_achievements_count_${userId}`;
          const knownCount = parseInt(localStorage.getItem(knownAchievementsKey) || '0', 10);
          
          // 2. So sánh số lượng mới và cũ
          if (unlockedDtos.length > knownCount) {
            // Có thành tựu mới!
            
            // Tìm ra chính xác những thành tựu nào là mới
            const knownAchievements = JSON.parse(localStorage.getItem(`known_achievements_list_${userId}`) || '[]');
            const newAchievements = unlockedDtos.filter(dto => !knownAchievements.includes(dto.name));

            // 3. Gửi thông báo cho từng thành tựu mới
            newAchievements.forEach(newAchDto => {
              // Tìm thông tin chi tiết (icon, description) từ bảng tra cứu
              const achievementTemplate = allAchievements.find(a => a.title === newAchDto.name);
              if (achievementTemplate) {
                // Gọi hàm từ context để tạo thông báo
                addAchievementNotification(achievementTemplate);
              }
            });
          }

          // 4. Cập nhật localStorage với dữ liệu mới nhất
          localStorage.setItem(knownAchievementsKey, unlockedDtos.length.toString());
          localStorage.setItem(`known_achievements_list_${userId}`, JSON.stringify(unlockedDtos.map(dto => dto.name)));

          // === KẾT THÚC LOGIC PHÁT HIỆN ===

          // Chuyển List thành Map để render giao diện (giữ nguyên)
          const unlockedMap = new Map();
          unlockedDtos.forEach(dto => unlockedMap.set(dto.name, dto));
          setUserAchievementsMap(unlockedMap);

        } catch (error) {
          console.error("Lỗi khi fetch thành tựu:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAndProcessAchievements();
    } else {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [userId, addAchievementNotification]);

  // Phân loại các thành tựu dựa trên "bảng tra cứu" allAchievements
  const achievementsByCategory = {
    time: allAchievements.filter(a => a.category === 'time' || a.category === 'health'),
    money: allAchievements.filter(a => a.category === 'money'),
    mission: allAchievements.filter(a => a.category === 'mission' || a.category === 'diary'), // Gộp chung
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

  // Render giao diện chính
  return (
    <>
      <NavBar />
      <div className="achievement-page">
        <header className="achievement-header">
          <h1>Bộ Sưu Tập Thành Tựu</h1>
          <p>Mỗi huy hiệu là một minh chứng cho sự kiên trì và nỗ lực phi thường của bạn!</p>
        </header>

        <section className="achievement-category">
          <h2>Cột Mốc & Sức Khỏe</h2>
          <div className="achievement-grid">
            {achievementsByCategory.time.map(achTemplate => {
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