
import { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import {
  CalendarDays,
  DollarSign,
  Target,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import { mapApiToFeAchievement } from "../Achievements/achievement-mapper";
import "./ranking.css";


const getAvatarUrl = (member) => {
  if (member?.username?.trim()) {
    const formattedName = member.username.trim().replace(/\s+/g, "+");
    return `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
  }
  return "/default-avatar.png";
};

function getTopAchievements(member, allAchievementTemplates) {
  if (!allAchievementTemplates || allAchievementTemplates.length === 0)
    return [];
  const categoriesInOrder = ["time", "money", "mission", "diary"];
  const categoryChampions = [];
  categoriesInOrder.forEach((category) => {
    const achievementsInCategory = allAchievementTemplates.filter(
      (ach) => ach.category === category
    );
    const unlockedInCategory = achievementsInCategory.filter((ach) => {
      switch (ach.category) {
        case "time":
          return member.quitDays >= ach.threshold;
        case "money":
          return member.moneySaved >= ach.threshold;
        case "mission":
          return member.taskCompleted >= ach.threshold;
        case "diary":
          return false;
        default:
          return false;
      }
    });
    if (unlockedInCategory.length > 0) {
      const champion = unlockedInCategory.reduce((best, current) => {
        return current.threshold > best.threshold ? current : best;
      });
      categoryChampions.push(champion);
    }
  });
  const tierOrder = { gold: 3, silver: 2, bronze: 1 };
  const categoryPriority = { time: 4, money: 3, mission: 2, diary: 1 };
  categoryChampions.sort((a, b) => {
    const tierCompare = (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0);
    if (tierCompare !== 0) return tierCompare;
    return (
      (categoryPriority[b.category] || 0) - (categoryPriority[a.category] || 0)
    );
  });
  return categoryChampions.slice(0, 3);
}

function MemberRankCard({ rank, member, topAchievements, isActive, onClick }) {
  const formattedMoney = Math.round(member.moneySaved).toLocaleString("vi-VN");

  return (
    <div
      className={`member-rank-card ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="card-main-content">
        <span className={`rank-number rank-${rank}`}>{rank}</span>

        <img
          src={member.avatarUrl || getAvatarUrl(member)}
          alt={member.username}
          className="member-avatar"
        />
        <p className="member-name">{member.username}</p>
        <div className="member-stats">
          <div className="stat-item">
            <CalendarDays size={20} className="stat-icon" />
            <strong className="stat-value">{member.quitDays}</strong>
            <span className="stat-label">Ngày cai</span>
          </div>
          <div className="stat-item">
            <DollarSign size={20} className="stat-icon" />
            <strong className="stat-value">{formattedMoney}</strong>
            <span className="stat-label">Tiết kiệm</span>
          </div>
          <div className="stat-item">
            <Target size={20} className="stat-icon" />
            <strong className="stat-value">{member.taskCompleted}</strong>
            <span className="stat-label">Nhiệm vụ</span>
          </div>
        </div>
        <ChevronDown className="chevron-icon" size={24} />
      </div>
      <div className="card-details-content">
        {topAchievements.length > 0 ? (
          topAchievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div key={ach.templateID} className="achievement-detail">
                <Icon size={24} className="achievement-icon" />
                <div className="achievement-text">
                  <strong>{ach.title}</strong>
                  <span>{ach.description}</span>
                </div>
              </div>
            );
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

function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [allAchievementTemplates, setAllAchievementTemplates] = useState([]);
  const [rankingType, setRankingType] = useState("days");
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setActiveIndex(null);
      let apiUrl = "http://localhost:8080/api/rankings";
      if (rankingType === "money")
        apiUrl = "http://localhost:8080/api/rankings/Rankingmoney";
      else if (rankingType === "mission")
        apiUrl = "http://localhost:8080/api/rankings/RankingsMission";
      try {
        const [rankingRes, templateRes] = await Promise.all([
          fetch(apiUrl),
          fetch(`http://localhost:8080/api/achievement-templates`),
        ]);
        if (!rankingRes.ok || !templateRes.ok)
          throw new Error("Lỗi tải dữ liệu");
        const rankingData = await rankingRes.json();
        const templateData = await templateRes.json();
        setRankings(rankingData);
        setAllAchievementTemplates(templateData.map(mapApiToFeAchievement));
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu ranking:", error);
        setRankings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
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
          <p>
            Vinh danh những chiến binh có thành tích cai thuốc ấn tượng nhất!
          </p>
        </header>
        <div className="ranking-tabs">
          <button
            className={`ranking-tab-button ${
              rankingType === "days" ? "active" : ""
            }`}
            onClick={() => setRankingType("days")}
          >
            🏆 Theo Ngày Cai
          </button>
          <button
            className={`ranking-tab-button ${
              rankingType === "money" ? "active" : ""
            }`}
            onClick={() => setRankingType("money")}
          >
            💰 Theo Tiền Tiết Kiệm
          </button>
          <button
            className={`ranking-tab-button ${
              rankingType === "mission" ? "active" : ""
            }`}
            onClick={() => setRankingType("mission")}
          >
            🎯 Theo Nhiệm Vụ
          </button>
        </div>
        <div className="ranking-list">
          {isLoading ? (
            <div
              className="loading-container"
              style={{
                minHeight: "40vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "1rem",
                flex: 1,
              }}
            >
              <LoaderCircle className="spinner" size={48} />
              <p>Đang tải bảng xếp hạng...</p>
            </div>
          ) : rankings.length > 0 ? (
            rankings.map((member, index) => {
              const topAchievements = getTopAchievements(
                member,
                allAchievementTemplates
              );
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
            <p className="no-entries">
              Không có dữ liệu để hiển thị bảng xếp hạng.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Ranking;
