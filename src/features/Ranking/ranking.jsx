import { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import NavBar from "../../components/NavBar/NavBar";
import { CalendarDays, DollarSign, Target, ChevronDown, LoaderCircle } from 'lucide-react';
import { allAchievements } from '../Achievements/mock-achievements'; // Import "bảng tra cứu" đã cập nhật

// --- HÀM HELPER: "BỘ NÃO" CỦA TRANG RANKING ---
// Suy luận ra các thành tựu cao nhất từ các chỉ số của người dùng
//--HÀM GẺTOP ACHIEVEMENTS--V2--
// --- HÀM HELPER ĐÃ ĐƯỢC CẬP NHẬT THEO LOGIC MỚI ---
function getTopAchievements(member) {
  // Định nghĩa các loại thành tựu và thứ tự ưu tiên của chúng
  const categoriesInOrder = ['time', 'money', 'mission', 'diary'];
  
  const categoryChampions = [];

  // Bước 1: Tìm thành tựu cao nhất (champion) cho mỗi loại
  categoriesInOrder.forEach(category => {
    // Lọc ra tất cả các thành tựu thuộc loại này từ bảng tra cứu
    const achievementsInCategory = allAchievements.filter(ach => ach.category === category);

    // Tìm những thành tựu mà người dùng đã mở khóa trong loại này
    const unlockedInCategory = achievementsInCategory.filter(ach => {
      switch (ach.category) {
        case 'time':
          return member.quitDays >= ach.milestone;
        case 'money':
          return member.moneySaved >= ach.milestone;
        case 'mission':
          return member.taskCompleted >= ach.milestone;
        case 'diary':
          // UserRankingDTO không có dữ liệu về nhật ký, nên tạm thời bỏ qua
          // Nếu sau này có, bạn chỉ cần thêm `member.diaryCount >= ach.milestone`
          return false; 
        default:
          return false;
      }
    });

    // Nếu có ít nhất 1 thành tựu đã mở khóa trong loại này
    if (unlockedInCategory.length > 0) {
      // Tìm ra cái có mốc cao nhất
      const champion = unlockedInCategory.reduce((best, current) => {
        return current.milestone > best.milestone ? current : best;
      });
      categoryChampions.push(champion);
    }
  });

  // Bước 2: Sắp xếp các "nhà vô địch" này
  const tierOrder = { gold: 3, silver: 2, bronze: 1 };
  // Thứ tự ưu tiên giữa các loại, nếu cấp bậc bằng nhau
  const categoryPriority = { time: 4, money: 3, mission: 2, diary: 1 };

  categoryChampions.sort((a, b) => {
    // Ưu tiên 1: Cấp bậc (cao xuống thấp)
    const tierCompare = (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0);
    if (tierCompare !== 0) return tierCompare;

    // Ưu tiên 2: Nếu cùng cấp bậc, xét loại (cao xuống thấp)
    return (categoryPriority[b.category] || 0) - (categoryPriority[a.category] || 0);
  });

  // Bước 3: Trả về 3 nhà vô địch hàng đầu
  return categoryChampions.slice(0, 3);
}


// --- COMPONENT CON: THẺ XẾP HẠNG ---
function MemberRankCard({ rank, member, topAchievements, isActive, onClick }) {
  const formattedMoney = Math.round(member.moneySaved).toLocaleString('vi-VN');

  return (
    <div className={`member-rank-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="card-main-content">
        <span className={`rank-number rank-${rank}`}>{rank}</span>
        <img src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.username}`} alt={member.username} className="member-avatar" />
        <p className="member-name">{member.username}</p>
        <div className="member-achievements-preview">
            <CalendarDays size={20} opacity={0.6} title={`${member.quitDays} ngày cai thuốc`} />
            <DollarSign size={20} opacity={0.6} title={`${formattedMoney} VNĐ tiết kiệm`} />
            <Target size={20} opacity={0.6} title={`${member.taskCompleted} nhiệm vụ`} />
        </div>
        <ChevronDown className="chevron-icon" size={24} />
      </div>

      <div className="card-details-content">
        {topAchievements.length > 0 ? (
          topAchievements.map(ach => {
            const Icon = ach.icon;
            return (
              <div key={ach.customLogicKey} className="achievement-detail">
                <Icon size={24} className="achievement-icon" />
                <div className="achievement-text">
                  <strong>{ach.title}</strong>
                  <span>{ach.description}</span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="achievement-detail">
            <p>Chưa có thành tựu nổi bật.</p>
          </div>
        )}
      </div>
    </div>
  );
}


// --- COMPONENT CHÍNH ---
function Ranking() {
    const [rankings, setRankings] = useState([]);
    const [rankingType, setRankingType] = useState('days'); // 'days', 'money', 'mission'
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const fetchRankings = async () => {
            setIsLoading(true);
            setActiveIndex(null); 

            let apiUrl = 'http://localhost:8080/api/rankings';
            if (rankingType === 'money') {
                apiUrl = 'http://localhost:8080/api/rankings/Rankingmoney';
            } else if (rankingType === 'mission') {
                apiUrl = 'http://localhost:8080/api/rankings/RankingsMission';
            }

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
                const data = await response.json();
                setRankings(data);
            } catch (error) {
                console.error("Lỗi khi fetch bảng xếp hạng:", error);
                setRankings([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRankings();
    }, [rankingType]);

    const handleCardClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <NavBar />
            <div className="ranking-page-container">
                <header className="ranking-header">
                    <h1>Bảng Vàng Kiên Trì</h1>
                    <p>Vinh danh những chiến binh có thành tích cai thuốc ấn tượng nhất!</p>
                </header>

                <div className="ranking-tabs">
                    <button className={`ranking-tab-button ${rankingType === 'days' ? 'active' : ''}`} onClick={() => setRankingType('days')}>
                        🏆 Theo Ngày Cai
                    </button>
                    <button className={`ranking-tab-button ${rankingType === 'money' ? 'active' : ''}`} onClick={() => setRankingType('money')}>
                        💰 Theo Tiền Tiết Kiệm
                    </button>
                    <button className={`ranking-tab-button ${rankingType === 'mission' ? 'active' : ''}`} onClick={() => setRankingType('mission')}>
                        🎯 Theo Nhiệm Vụ
                    </button>
                </div>

                <div className="ranking-list">
                    {isLoading ? (
                        <div className="loading-container" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                          <LoaderCircle className="spinner" size={48} />
                          <p>Đang tải bảng xếp hạng...</p>
                        </div>
                    ) : rankings.length > 0 ? (
                        rankings.map((member, index) => {
                            const topAchievements = getTopAchievements(member);
                            return (
                                <MemberRankCard
                                    key={`${member.username}-${index}`}
                                    rank={index + 1}
                                    member={member}
                                    topAchievements={topAchievements}
                                    isActive={activeIndex === index}
                                    onClick={() => handleCardClick(index)}
                                />
                            );
                        })
                    ) : (
                        <p className="no-entries">Không có dữ liệu để hiển thị bảng xếp hạng.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Ranking;