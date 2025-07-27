// src/features/Achievements/achievement.jsx 

import { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import { Share2, Lock, LoaderCircle } from 'lucide-react';
import useUserId from "../../hooks/useUserId";
import './achievement.css';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import { mapApiToFeAchievement } from './achievement-mapper';

// --- CÁC COMPONENT   ---
function formatAchievedDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function AchievementBadge({ achievementInfo, unlockedData }) {
  if (!achievementInfo || !achievementInfo.icon) {
    return null;
  }
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
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievementsMap, setUserAchievementsMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const { refreshNotifications } = useNotifications();

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [templatesRes, unlockedRes] = await Promise.all([
            fetch(`http://localhost:8080/api/achievement-templates`),
            fetch(`http://localhost:8080/api/achievements/${userId}`)
        ]);

        if (!templatesRes.ok || !unlockedRes.ok) throw new Error('Lỗi tải dữ liệu thành tựu');


        const templateDtos = await templatesRes.json(); // Lấy TẤT CẢ template từ templatesRes
        const unlockedDtos = await unlockedRes.json(); // Lấy các achievement ĐÃ MỞ KHÓA từ unlockedRes

        const feTemplates = templateDtos.map(mapApiToFeAchievement);
        setAllAchievements(feTemplates); // State  chứa tất cả các thành tựu có thể có
        const knownAchievementsKey = `known_achievements_count_${userId}`;
        const knownCount = parseInt(localStorage.getItem(knownAchievementsKey) || '0', 10);
        if (unlockedDtos.length > knownCount) {
             const knownAchievements = JSON.parse(localStorage.getItem(`known_achievements_list_${userId}`) || '[]');
             const newAchievements = unlockedDtos.filter(dto => !knownAchievements.includes(dto.name));
             newAchievements.forEach(newAchDto => {
                const achievementTemplate = feTemplates.find(a => a.title === newAchDto.name);
                if (achievementTemplate) {
                  // Refresh notifications để lấy thông báo thành tựu mới từ backend
                  refreshNotifications();
                }
             });
        }
        localStorage.setItem(knownAchievementsKey, unlockedDtos.length.toString());
        localStorage.setItem(`known_achievements_list_${userId}`, JSON.stringify(unlockedDtos.map(dto => dto.name)));

        // Tạo Map từ các thành tựu đã mở khóa để dễ kiểm tra
        const unlockedMap = new Map(unlockedDtos.map(dto => [dto.name, dto]));
        setUserAchievementsMap(unlockedMap);

      } catch (error) {
        console.error("Lỗi khi fetch thành tựu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [userId, refreshNotifications]);

  const achievementsByCategory = {
    time: allAchievements.filter(a => a.category === 'time' || a.category === 'health'),
    money: allAchievements.filter(a => a.category === 'money'),
    mission: allAchievements.filter(a => a.category === 'mission' || a.category === 'diary'),
  };

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

        {/* Các section render sẽ không thay đổi */}
        <section className="achievement-category">
          <h2>Cột Mốc & Sức Khỏe</h2>
          <div className="achievement-grid">
            {achievementsByCategory.time.map(achTemplate => {
              const unlockedData = userAchievementsMap.get(achTemplate.title);
              return <AchievementBadge 
                key={achTemplate.templateID}
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
                key={achTemplate.templateID}
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
                key={achTemplate.templateID}
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