import { useState } from 'react';
import Footer from '../../components/Footer/Footer';
import NavBar from "../../components/NavBar/NavBar"
import { CalendarDays, DollarSign, Target, ChevronDown } from 'lucide-react';

// --- DỮ LIỆU MẪU (Tạm thời, sau này sẽ lấy từ API) ---
const mockData = [
  { id: 1, name: 'An Nguyễn', avatarUrl: 'https://i.pravatar.cc/150?u=annguyen', daysQuit: 124, moneySaved: 2313900, missionsCompleted: 353 },
  { id: 2, name: 'Bình Trần', avatarUrl: 'https://i.pravatar.cc/150?u=binhtran', daysQuit: 115, moneySaved: 2150000, missionsCompleted: 330 },
  { id: 3, name: 'Cường Lê', avatarUrl: 'https://i.pravatar.cc/150?u=cuongle', daysQuit: 102, moneySaved: 1980500, missionsCompleted: 290 },
  { id: 4, name: 'Dũng Phạm', avatarUrl: 'https://i.pravatar.cc/150?u=dungpham', daysQuit: 98, moneySaved: 1870000, missionsCompleted: 285 },
  { id: 5, name: 'Hương Giang', avatarUrl: 'https://i.pravatar.cc/150?u=huonggiang', daysQuit: 85, moneySaved: 1650000, missionsCompleted: 250 },
  { id: 6, name: 'Khánh Vy', avatarUrl: 'https://i.pravatar.cc/150?u=khanhvy', daysQuit: 76, moneySaved: 1510000, missionsCompleted: 222 },
  { id: 7, name: 'Long Vũ', avatarUrl: 'https://i.pravatar.cc/150?u=longvu', daysQuit: 72, moneySaved: 1480000, missionsCompleted: 210 },
  { id: 8, name: 'Minh Hoàng', avatarUrl: 'https://i.pravatar.cc/150?u=minhhoang', daysQuit: 68, moneySaved: 1300000, missionsCompleted: 199 },
  { id: 9, name: 'Nam Tiến', avatarUrl: 'https://i.pravatar.cc/150?u=namtien', daysQuit: 61, moneySaved: 1250000, missionsCompleted: 180 },
  { id: 10, name: 'Oanh Đỗ', avatarUrl: 'https://i.pravatar.cc/150?u=oanhdo', daysQuit: 55, moneySaved: 1100000, missionsCompleted: 165 },
];

// --- Component Card cho mỗi thành viên ---
function MemberRankCard({ rank, member, isActive, onClick }) {
  // Định dạng số tiền cho dễ đọc
  const formattedMoney = member.moneySaved.toLocaleString('vi-VN');

  return (
    <div className={`member-rank-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="card-main-content">
        <span className={`rank-number rank-${rank}`}>{rank}</span>
        <img src={member.avatarUrl} alt={member.name} className="member-avatar" />
        <p className="member-name">{member.name}</p>
        <div className="member-achievements-preview">
            <CalendarDays size={20} opacity={0.6} />
            <DollarSign size={20} opacity={0.6} />
            <Target size={20} opacity={0.6} />
        </div>
        <ChevronDown className="chevron-icon" size={24} />
      </div>

      {/* Phần nội dung mở rộng, chỉ hiện khi 'active' */}
      <div className="card-details-content">
        <div className="achievement-detail">
          <CalendarDays size={24} className="achievement-icon" />
          <div className="achievement-text">
            <strong>{member.daysQuit}</strong>
            <span>Ngày cai thuốc</span>
          </div>
        </div>
        <div className="achievement-detail">
          <DollarSign size={24} className="achievement-icon" />
          <div className="achievement-text">
            <strong>{formattedMoney} VNĐ</strong>
            <span>Đã tiết kiệm</span>
          </div>
        </div>
        <div className="achievement-detail">
          <Target size={24} className="achievement-icon" />
          <div className="achievement-text">
            <strong>{member.missionsCompleted}</strong>
            <span>Nhiệm vụ hoàn thành</span>
          </div>
        </div>
      </div>
    </div>
  );
}


function Ranking() {
    // Sắp xếp member theo số ngày cai thuốc giảm dần
    const sortedMembers = mockData.sort((a, b) => b.daysQuit - a.daysQuit);

    const [activeIndex, setActiveIndex] = useState(null);

    const handleCardClick = (index) => {
        // Nếu click vào card đang mở thì đóng lại, nếu không thì mở card mới
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <NavBar />
            <div className="ranking-page-container">
                <div className="ranking-header">
                    <h1>Bảng Vàng Kiên Trì</h1>
                    <p>Vinh danh 100 chiến binh có thành tích cai thuốc ấn tượng nhất!</p>
                </div>

                <div className="ranking-list">
                    {sortedMembers.map((member, index) => (
                        <MemberRankCard
                            key={member.id}
                            rank={index + 1}
                            member={member}
                            isActive={activeIndex === index}
                            onClick={() => handleCardClick(index)}
                        />
                    ))}
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default Ranking;