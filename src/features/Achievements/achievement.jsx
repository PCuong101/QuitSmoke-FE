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
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchAndProcessAchievements = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch đồng thời dữ liệu chính và dữ liệu phụ
        const [achievementsResponse, savingsResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/achievements/${userId}`),
          fetch(`http://localhost:8080/api/quit-plan/${userId}/savings`)
        ]);

        if (!achievementsResponse.ok) throw new Error(`Lỗi API thành tựu: ${achievementsResponse.status}`);
        
        const unlockedDtos = await achievementsResponse.json();
        let totalSavings = 0;
        if (savingsResponse.ok) {
            const savingsData = await savingsResponse.json();
            totalSavings = savingsData.totalSavings || 0;
        }

        // 2. Tạo một Map duy nhất, là "nguồn chân lý" cuối cùng để hiển thị
        const finalDisplayMap = new Map();
        unlockedDtos.forEach(dto => finalDisplayMap.set(dto.name, dto));

        // 3. Lấy dữ liệu đã biết từ localStorage để so sánh
        const knownAchievementsKey = `known_achievements_count_${userId}`;
        const knownAchievementsListKey = `known_achievements_list_${userId}`;
        const knownCount = parseInt(localStorage.getItem(knownAchievementsKey) || '0', 10);
        const knownAchievementsList = JSON.parse(localStorage.getItem(knownAchievementsListKey) || '[]');
        
        // 4. KIỂM TRA VÀ CẬP NHẬT TRỰC TIẾP VÀO `finalDisplayMap`
        // Lặp qua tất cả các mẫu thành tựu để kiểm tra điều kiện
        allAchievements.forEach(achTemplate => {
          // Chỉ kiểm tra các thành tựu thuộc loại 'money' mà chưa được mở khóa từ API
          if (achTemplate.category === 'money' && !finalDisplayMap.has(achTemplate.title)) {
            // Nếu đủ điều kiện tiền tiết kiệm
            if (totalSavings >= achTemplate.milestone) {
              const newFakeDto = {
                name: achTemplate.title,
                achievedAt: new Date().toISOString(),
                description: achTemplate.description
              };
              // Cập nhật trực tiếp vào Map cuối cùng
              finalDisplayMap.set(achTemplate.title, newFakeDto);
            }
          }
        });

        // 5. SO SÁNH `finalDisplayMap` (ĐÃ CẬP NHẬT) VỚI LOCALSTORAGE ĐỂ GỬI THÔNG BÁO
        if (finalDisplayMap.size > knownCount) {
            finalDisplayMap.forEach((dto, title) => {
                // Nếu thành tựu này không có trong danh sách đã biết -> nó là mới!
                if (!knownAchievementsList.includes(title)) {
                    const achievementTemplate = allAchievements.find(a => a.title === title);
                    if (achievementTemplate) {
                        addAchievementNotification(achievementTemplate);
                    }
                }
            });
        }
        
        // 6. CẬP NHẬT LOCALSTORAGE VỚI TRẠNG THÁI MỚI NHẤT
        localStorage.setItem(knownAchievementsKey, finalDisplayMap.size.toString());
        localStorage.setItem(knownAchievementsListKey, JSON.stringify(Array.from(finalDisplayMap.keys())));

        // 7. SET STATE ĐỂ RENDER GIAO DIỆN BẰNG MAP CUỐI CÙNG
        setUserAchievementsMap(finalDisplayMap);

      } catch (error) {
        console.error("Lỗi khi fetch và xử lý thành tựu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessAchievements();
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