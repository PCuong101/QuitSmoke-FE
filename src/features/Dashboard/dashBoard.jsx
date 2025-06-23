import * as icon from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { SiOxygen } from "react-icons/si";
import axios from 'axios';
import { mockTodayMissionList } from "../Missions/mock-missions"; // <-- IMPORT NHIỆM VỤ HÔM NAY
import NavBar from '../../components/NavBar/NavBar';
import useUserId from '../../hooks/useUserId';


// ... Các phần code khác của Dashboard.jsx giữ nguyên ...
function ImprovedCard(props) {
  const isPositive = props.percentageChange >= 0;
  const percentageText = `${isPositive ? '+' : ''}${props.percentageChange}%`;

  return (
    <div className="pulse-card">
      <div className="pulse-header">
        <div className="pulse-title">
          <span className="pulse-icon"><props.Icon></props.Icon></span>
          <span><strong>{props.title}</strong></span>
        </div>
        <div className={`pulse-change ${isPositive ? 'positive' : 'negative'}`}>{percentageText}</div>
      </div>
      <div className="pulse-value">{props.value} {props.unit}</div>
      <div className="pulse-bar">
        <div className="pulse-bar-fill" style={{ width: `${props.progress}%` }}></div>
      </div>
      <div className="pulse-value">{props.timeRemaining}</div>
    </div>
  );
}

function improvedList() {
  const [userId, setUserId] = useState("");
  const [healthList, setHealthList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy userId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/get-session-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        if (!res.ok) throw new Error("Không tìm thấy user");

        const userData = await res.json();
        setUserId(userData.userId);
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
      }
    };

    fetchUser();
  }, []);
  

  // Lấy health milestone
  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/health-milestones/progress/${userId}`);
        if (!res.ok) throw new Error("Lỗi khi fetch progress");
        const data = await res.json();
        setHealthList(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);


  return { healthList, loading };
}


function SavingsCardWithDetail() {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const userId = useUserId();

  const [savedMoney, setSavedMoney] = useState(0);
useEffect(() => {
  const fetchData = async () => {
    try {
      console.log(userId);
      const response = await fetch(`http://localhost:8080/api/quit-plan/${userId}/savings`);
      const savedMoney = await response.json();
      setSavedMoney(savedMoney);
    } catch (error) {
      console.error("Lỗi khi fetch:", error);
    }
  };

  fetchData();
}, [userId]);

  return (
    <>
      {/* Card chính */}
      <div className="savings-container">
        <h3>Số tiền tiết kiệm</h3>
        <div className="savings-content">
          <div className="savings-left">
            <p className="label">Số tiền đã tiết kiệm</p>
            <p className="value green">{savedMoney.totalSavings} đ</p>
            <button className="detail-button" onClick={handleOpen}>Xem chi tiết</button>
          </div>
          <div className="savings-right">
            <p className="label">Tiết kiệm trong 1 năm</p>
            <p className="value blue">{savedMoney.moneyPerYear} đ</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>Chi tiết số tiền</h4>
              <icon.X className="close-btn" onClick={handleClose}></icon.X>
            </div>
            <div className="modal-body">
              <div className="modal-left">
                <p><strong>Số tiền tiết kiệm được</strong></p>
                <p className="green">{savedMoney.totalSavings} đ</p>

                <p>Đã tiêu cho thuốc lá</p>
                <p className="red">{savedMoney.totalSpentOnCigarettes} đ</p>

                <p>Đã tiêu cho liệu pháp thay thế Nicotine</p>
                <p className="orange">{savedMoney.totalSpentOnNrt} đ</p>
              </div>
              <div className="modal-right">
                <p><strong>Mỗi ngày</strong></p>
                <p>{savedMoney.moneyPerDay} đ</p>

                <p><strong>Mỗi tuần</strong></p>
                <p>{savedMoney.moneyPerMonth} đ</p>

                <p><strong>Mỗi tháng</strong></p>
                <p>{savedMoney.moneyPerWeek} đ</p>

                <p><strong>Mỗi năm</strong></p>
                <p>{savedMoney.moneyPerYear} đ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function DashBoard() {
  const { healthList, loading } = improvedList();

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <NavBar></NavBar>
      <div id='dashBoard'>
        <h2 style={{ textAlign: 'left' }}><strong>Tổng Quan</strong></h2>
        <h3 style={{ textAlign: 'left' }}>Cải thiện sức khỏe của bạn</h3>
        <div className='ImprovedCardContainer'>
          <ImprovedCard percentageChange={healthList[0].progressPercent} timeRemaining={healthList[0].timeRemaining} title={healthList[0].name} Icon={icon.Heart} value={healthList[0].progressPercent} unit="%" progress={healthList[0].progressPercent}></ImprovedCard>
          <ImprovedCard percentageChange={healthList[1].progressPercent} timeRemaining={healthList[1].timeRemaining} title={healthList[1].name} Icon={SiOxygen} value={healthList[1].progressPercent} unit="%" progress={healthList[1].progressPercent} />
          <ImprovedCard percentageChange={healthList[2].progressPercent} timeRemaining={healthList[2].timeRemaining} title={healthList[2].name} Icon={SiOxygen} value={healthList[2].progressPercent} unit="%" progress={healthList[2].progressPercent} />
          <ImprovedCard percentageChange={healthList[3].progressPercent} timeRemaining={healthList[3].timeRemaining} title={healthList[3].name} Icon={SiOxygen} value={healthList[3].progressPercent} unit="%" progress={healthList[3].progressPercent} />
          <ImprovedCard percentageChange={healthList[4].progressPercent} timeRemaining={healthList[4].timeRemaining} title={healthList[4].name} Icon={SiOxygen} value={healthList[4].progressPercent} unit="%" progress={healthList[4].progressPercent} />
        </div>

        <div className='ImprovedCardContainer'>
          
          <ImprovedCard percentageChange={healthList[5].progressPercent} timeRemaining={healthList[5].timeRemaining} title={healthList[5].name} Icon={SiOxygen} value={healthList[5].progressPercent} unit="%" progress={healthList[5].progressPercent} />
          <ImprovedCard percentageChange={healthList[6].progressPercent} timeRemaining={healthList[6].timeRemaining} title={healthList[6].name} Icon={SiOxygen} value={healthList[6].progressPercent} unit="%" progress={healthList[6].progressPercent} />
          <ImprovedCard percentageChange={healthList[7].progressPercent} timeRemaining={healthList[7].timeRemaining} title={healthList[7].name} Icon={SiOxygen} value={healthList[7].progressPercent} unit="%" progress={healthList[7].progressPercent} />
          <ImprovedCard percentageChange={healthList[8].progressPercent} timeRemaining={healthList[8].timeRemaining} title={healthList[8].name} Icon={SiOxygen} value={healthList[8].progressPercent} unit="%" progress={healthList[8].progressPercent} />
          <ImprovedCard percentageChange={healthList[9].progressPercent} timeRemaining={healthList[9].timeRemaining} title={healthList[9].name} Icon={SiOxygen} value={healthList[9].progressPercent} unit="%" progress={healthList[9].progressPercent} />
          
        </div>

        <div className='ImprovedCardContainer'>
          <ImprovedCard percentageChange={healthList[10].progressPercent} timeRemaining={healthList[10].timeRemaining} title={healthList[10].name} Icon={SiOxygen} value={healthList[10].progressPercent} unit="%" progress={healthList[10].progressPercent} />
          <ImprovedCard percentageChange={healthList[11].progressPercent} timeRemaining={healthList[11].timeRemaining} title={healthList[11].name} Icon={SiOxygen} value={healthList[11].progressPercent} unit="%" progress={healthList[11].progressPercent} />
          <ImprovedCard percentageChange={healthList[12].progressPercent} timeRemaining={healthList[12].timeRemaining} title={healthList[12].name} Icon={SiOxygen} value={healthList[12].progressPercent} unit="%" progress={healthList[12].progressPercent} />
          <ImprovedCard percentageChange={healthList[13].progressPercent} timeRemaining={healthList[13].timeRemaining} title={healthList[13].name} Icon={SiOxygen} value={healthList[13].progressPercent} unit="%" progress={healthList[13].progressPercent} />
        </div>
      </div>
      <div id='savedMoney'>
        <SavingsCardWithDetail></SavingsCardWithDetail>
      </div>
    </>
  )
}


export default DashBoard;
export { NavBar };