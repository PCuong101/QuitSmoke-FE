import NavBar from "../../components/NavBar/NavBar"
import { useState, useEffect } from "react";

// Một icon 'X' đơn giản bằng SVG để đóng modal
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


function Diary() {

  const getLocalISODateTime = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [formData, setFormData] = useState({
    logDate: getLocalISODateTime(), // "YYYY-MM-DDTHH:mm"
    smokedToday: "false",
    cravingLevel: 0,
    stressLevel: 0,
    mood: "neutral",
    cigarettesSmoked: 0,
    spentMoneyOnCigarettes: 0
  });
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const user = await fetch("http://localhost:8080/api/auth/get-session-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include" // gửi cookie (session) nếu dùng Spring Boot hoặc Express session
        });
        if (!user) {
          console.error("Không tìm thấy user");
          return;
        } else {
          const userData = await user.json();
          const userId = userData.userId; // Lấy ID người dùng từ dữ liệu trả về
          setUserId(userId); // Lưu ID người dùng vào state
          const response = await fetch(`http://localhost:8080/api/user-daily-logs/get-daily-logs/${userId}`);
          if (!response.ok) throw new Error("Lỗi khi tải dữ liệu nhật ký");

          const data = await response.json();
          setDiaryEntries(data);
        }
      } catch (error) {
        console.error("Fetch diary entries error:", error);
      }
    };

    fetchDiaryEntries();
  }, []);

  // Ngăn cuộn trang nền khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Đảm bảo giá trị là số cho các input number
    const processedValue = type === 'number' || type === 'range' ? parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      userId,
      ...formData,
    };
    console.log(dataToSend);
    try {
      const response = await fetch('http://localhost:8080/api/user-daily-logs/create-daily-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        alert("Lỗi khi gửi nhật ký.", response.text());
        throw new Error("Lỗi khi gửi nhật ký");
      }

      // Sau khi gửi thành công, gọi lại GET để cập nhật danh sách
      const updated = await fetch(`http://localhost:8080/api/user-daily-logs/get-daily-logs/${userId}`);
      const updatedData = await updated.json();
      setDiaryEntries(updatedData);

      // Đóng modal và reset form
      setIsModalOpen(false);


      setFormData({
        logDate: getLocalISODateTime(),
        smokedToday: "false",
        cravingLevel: 0,
        stressLevel: 0,
        mood: "neutral",
        cigarettesSmoked: 0,
        spentMoneyOnCigarettes: 0
      });
    } catch (error) {
      console.error("Lỗi khi lưu nhật ký:", error);
      alert("Đã xảy ra lỗi khi gửi nhật ký. Vui lòng thử lại.");
    }
  };


  return (
    <div className="dry-diary-container">
      <NavBar />
      <div className="dry-content">
        <div className="dry-header">
          <h1 className="dry-title">Nhật ký cai thuốc</h1>
          <div className="dry-button-container">
            <button onClick={() => setIsModalOpen(true)} className="dry-add-button">
              Thêm nhật ký
            </button>
          </div>
        </div>
        <div className="dry-history-card">
          <h2 className="dry-subtitle">Lịch sử nhật ký</h2>
          {diaryEntries.length === 0 ? (
            <p className="dry-no-entries">Chưa có nhật ký nào.</p>
          ) : (
            <div className="dry-history-list">
              {diaryEntries.map((entry) => (
                <div key={entry.logID} className="dry-history-item">
                  <div className="dry-history-details">
                    <p className="dry-history-text">
                      <span className="dry-history-date">{new Date(entry.logDate).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Hút thuốc:</span>
                      <span className="dry-history-value" style={{ color: entry.smokedToday === true ? "#ef4444" : "#10b981", fontWeight: 'bold' }}>
                        {entry.smokedToday === true ? "Có" : "Không"}
                      </span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Mức độ thèm:</span>
                      <span className="dry-history-value">{entry.cravingLevel}/10</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Mức độ căng thẳng:</span>
                      <span className="dry-history-value">{entry.stressLevel}/10</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Chi phí NRT:</span>
                      <span className="dry-history-value">{entry.spentMoneyOnNtr.toLocaleString()} VNĐ</span>
                    </p>
                  </div>
                  <p className="dry-history-time">
                    {new Date(entry.logDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="dry-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="dry-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="dry-modal-close-button" onClick={() => setIsModalOpen(false)}>
              <CloseIcon />
            </button>
            <h2 className="dry-modal-title">Nhật ký hôm nay</h2>
            <form onSubmit={handleSubmit}>
              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="logDate">Ngày & giờ ghi nhật ký</label>
                <input
                  id="logDate"
                  type="datetime-local"
                  name="logDate"
                  value={formData.logDate}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label">Hôm nay bạn có hút điếu nào không?</label>
                <div className="dry-modal-radio-group">
                  <label className="dry-modal-radio">
                    <input
                      type="radio"
                      name="smokedToday"
                      value="false"
                      checked={formData.smokedToday === "false"}
                      onChange={handleInputChange}
                    />
                    <span className="dry-modal-radio-custom">Không</span>
                  </label>
                  <label className="dry-modal-radio">
                    <input
                      type="radio"
                      name="smokedToday"
                      value="true"
                      checked={formData.smokedToday === "true"}
                      onChange={handleInputChange}
                    />
                    <span className="dry-modal-radio-custom">Có</span>
                  </label>
                </div>
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="cravingLevel">Tâm trạng</label>
                <div className="dry-modal-select">
                  <select
                    id="mood"
                    type=""
                    name="mood"
                    min="0"
                    max="10"
                    value={formData.mood}
                    onChange={handleInputChange}
                    className="dry-modal-input"
                  >
                    <option value="happy">Vui vẻ</option>
                    <option value="relaxed">Thư giãn</option>
                    <option value="neutral">Bình thường</option>
                    <option value="sad">Buồn bã</option>
                    <option value="angry">Tức giận</option>
                    <option value="anxious">Lo lắng</option>
                    <option value="bored">Chán nản</option>
                    <option value="tired">Mệt mỏi</option>
                  </select>
                </div>
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="cravingLevel">Mức độ thèm thuốc</label>
                <div className="dry-modal-range-container">
                  <input
                    id="cravingLevel"
                    type="range"
                    name="cravingLevel"
                    min="0"
                    max="10"
                    value={formData.cravingLevel}
                    onChange={handleInputChange}
                    className="dry-modal-range"
                  />
                  <span className="dry-modal-range-value">{formData.cravingLevel}</span>
                </div>
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="stressLevel">Mức độ căng thẳng</label>
                <div className="dry-modal-range-container">
                  <input
                    id="stressLevel"
                    type="range"
                    name="stressLevel"
                    min="0"
                    max="10"
                    value={formData.stressLevel}
                    onChange={handleInputChange}
                    className="dry-modal-range"
                  />
                  <span className="dry-modal-range-value">{formData.stressLevel}</span>
                </div>
              </div>

              <div className="dry-modal-field" hidden={formData.smokedToday === "false"}>
                <label className="dry-modal-label" htmlFor="cigarettesSmoked">Số điếu thuốc hút trong ngày</label>
                <input
                  id="cigarettesSmoked"
                  type="number"
                  name="cigarettesSmoked"
                  min="0"
                  value={formData.cigarettesSmoked}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="spentMoneyOnCigarettes">Tổng chi phí cho NRT (Liệu pháp thay thế Nicotine) (VNĐ)</label>
                <input
                  id="spentMoneyOnCigarettes"
                  type="number"
                  name="spentMoneyOnCigarettes"
                  min="0"
                  value={formData.spentMoneyOnCigarettes}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-buttons">
                <button type="button" onClick={() => setIsModalOpen(false)} className="dry-modal-button dry-modal-cancel">
                  Hủy
                </button>
                <button type="submit" className="dry-modal-button dry-modal-save">
                  Lưu nhật ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PHẦN CSS ĐÃ ĐƯỢC NÂNG CẤP --- */}
      <style>
        {`
          :root {
            --primary-color: #10b981;
            --primary-hover: #059669;
            --text-dark: #1f2937;
            --text-light: #6b7280;
            --bg-light: #f9fafb;
            --border-color: #d1d5db;
            --danger-color: #ef4444;
          }

          .dry-diary-container {
            min-height: 100vh;
            background-color: var(--bg-light);
          }
          .dry-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
          .dry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }
          .dry-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-dark);
            margin: 0;
          }
          .dry-add-button {
            background-color: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: background-color 0.2s ease, transform 0.1s ease;
          }
          .dry-add-button:hover {
            background-color: var(--primary-hover);
          }
          .dry-add-button:active {
            transform: scale(0.98);
          }
          .dry-history-card {
            background-color: #ffffff;
            padding: 1.5rem;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
          }
          .dry-subtitle {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-top: 0;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
          }
          .dry-no-entries {
            text-align: center;
            color: var(--text-light);
            font-size: 1rem;
            padding: 2rem 0;
          }
          .dry-history-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .dry-history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background-color: var(--bg-light);
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .dry-history-details {
            flex-grow: 1;
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            align-items: center;
          }
          .dry-history-text {
            margin: 0;
            font-size: 0.9rem;
          }
          .dry-history-date {
            font-weight: 600;
            font-size: 1rem;
            color: var(--text-dark);
            min-width: 90px;
          }
          .dry-history-label {
            font-weight: 500;
            margin-right: 0.5rem;
            color: var(--text-light);
          }
          .dry-history-value {
            font-weight: 600;
            color: var(--text-dark);
          }
          .dry-history-time {
            font-size: 0.8rem;
            color: var(--text-light);
            min-width: 50px;
            text-align: right;
          }

          /* --- CSS CHO MODAL --- */
          .dry-modal-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(17, 24, 39, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 50;
            padding: 1rem;
            /* Thêm hiệu ứng */
            opacity: 0;
            animation: fadeIn 0.3s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .dry-modal-content {
            background-color: #ffffff;
            padding: 2rem;
            border-radius: 16px;
            width: 100%;
            max-width: 480px;
            position: relative;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            /* Thêm hiệu ứng */
            transform: scale(0.95);
            animation: scaleIn 0.3s ease-out forwards;
            max-height: 90vh; /* giới hạn chiều cao modal */
  overflow-y: auto; /* bật cuộn dọc khi nội dung vượt quá */
          }
           @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0.8; }
            to { transform: scale(1); opacity: 1; }
          }
          .dry-modal-close-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-light);
            padding: 0.25rem;
            border-radius: 50%;
            transition: background-color 0.2s, color 0.2s;
          }
          .dry-modal-close-button:hover {
            background-color: var(--bg-light);
            color: var(--text-dark);
          }
          .dry-modal-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-dark);
            text-align: left;
            margin-top: 0;
            margin-bottom: 2rem;
          }
          .dry-modal-field {
            margin-bottom: 1.5rem;
          }
          .dry-modal-label {
            display: block;
            font-size: 0.9rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
          }
          .dry-modal-input {
            width: 95%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            background-color: #ffffff;
            color: var(--text-dark);
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .dry-modal-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
          }
          
          /* Styling cho radio button tùy chỉnh */
          .dry-modal-radio-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .dry-modal-radio input[type="radio"] {
            display: none; /* Ẩn radio button gốc */
          }
          .dry-modal-radio-custom {
            display: block;
            text-align: center;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease-in-out;
          }
          .dry-modal-radio input[type="radio"]:checked + .dry-modal-radio-custom {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            font-weight: 600;
          }
          .dry-modal-radio input[value="yes"]:checked + .dry-modal-radio-custom {
            background-color: var(--danger-color);
            border-color: var(--danger-color);
          }
          
          /* Styling cho thanh trượt */
           .dry-modal-range-container {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .dry-modal-range {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            background: var(--border-color);
            border-radius: 5px;
            outline: none;
            opacity: 0.9;
            transition: opacity .2s;
          }
          .dry-modal-range:hover {
            opacity: 1;
          }
          .dry-modal-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 2px rgba(0,0,0,0.2);
          }
          .dry-modal-range::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid white;
          }
          .dry-modal-range-value {
            background-color: var(--primary-color);
            color: white;
            min-width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-weight: 600;
          }
          
          .dry-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
          }
          .dry-modal-button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.2s ease;
          }
          .dry-modal-cancel {
            background-color: #ffffff;
            color: var(--text-dark);
            border: 1px solid var(--border-color);
          }
          .dry-modal-cancel:hover {
            background-color: var(--bg-light);
          }
          .dry-modal-save {
            background-color: var(--primary-color);
            color: white;
          }
          .dry-modal-save:hover {
            background-color: var(--primary-hover);
          }
          .dry-modal-button:active {
            transform: scale(0.98);
          }
        `}
      </style>
    </div>
  );
}

export default Diary;