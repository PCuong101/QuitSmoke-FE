import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import "./ServicePackage.css";
import { useUser } from "../../contexts/UserContext";
import * as icon from "lucide-react";
import ToastNotification from "../../components/ToastNotification/ToastNotification.jsx";

function ServicePackage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const { email, userId, role } = useUser();
  const [toastVisible, setToastVisible] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showYearlyModal, setShowYearlyModal] = useState(false);
  const [durationMonths, setDurationMonths] = useState(1);
  const [userPlan, setUserPlan] = useState(null);

  // Gọi API lấy danh sách gói dịch vụ
  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("http://localhost:8080/api/member-plans/list");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách gói dịch vụ");
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Lỗi tải gói dịch vụ:", error);
      }
    }
    fetchPlans();
    async function fetchUserPlan() {
      try {
        const response = await fetch(`http://localhost:8080/api/subscriptions/member/${userId}`);
        if (!response.ok) {
          throw new Error("Không thể tải gói dịch vụ của người dùng");
        }
        const data = await response.json();
        if (data.length === 0) {
          return;
        }
        setUserPlan(data[0].plan); // Giả sử data[0] là gói dịch vụ hiện tại của người dùng
        console.log("Gói dịch vụ của người dùng:", data[0].plan);
      } catch (error) {
        console.error("Lỗi tải gói dịch vụ của người dùng:", error);
      }
    }
    fetchUserPlan();
  }, []);

  async function handleVnpayPayment(plan, durationMonths) {
    try {
      const response = await fetch("http://localhost:8080/api/payment/vnpay/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: userId,
          planId: plan.planID,
          amount: plan.price * durationMonths,
          email: email,
          durationMonths: durationMonths
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error("VNPAY error:", error);
      alert("Có lỗi xảy ra khi tạo thanh toán VNPAY.");
    }
  }

  return (
    <>
      <div className="service-package-container">
        <NavBar />

        <div className="service-package-content">
          <h1 className="page-title">Chọn gói dịch vụ</h1>
          <p className="page-subtitle">
            Chọn gói phù hợp để có trải nghiệm tốt nhất trong hành trình cai thuốc
          </p>

          <div className="packages-grid">
            {plans.map((plan) => (
              <div key={plan.planID} className="package-card">
                <div className="card-header">
                  <h2 className="card-title">{plan.planName}</h2>
                  <div className={`card-price ${plan.price === 0 ? "green" : ""}`}>
                    {plan.price === 0 ? "Miễn phí" : `${plan.price.toLocaleString()}đ`}
                  </div>
                  <p className="card-price-note">{plan.description}</p>
                  <ul className="features-list">
                    {plan.features.split(",").map((feature, idx) => (
                      <li key={idx}>{feature.trim()}</li>
                    ))}
                  </ul>
                </div>
                {plan.price === 0 ? (
                  <button className="card-button btn-secondary">
                    Tiếp tục miễn phí
                  </button>
                ) : (
                  <button
                    style={{
                      opacity: role === 'MEMBER_VIP1' ? 0.5 : 1,
                      cursor: role === 'MEMBER_VIP1' ? 'not-allowed' : 'pointer',
                    }}
                    className="card-button btn-secondary"
                    onClick={() => {
                      if (role === "MEMBER_VIP1") {
                        setToastVisible(true);
                        setTimeout(() => setToastVisible(false), 3000);
                      } else {
                        setSelectedPlan(plan);
                        if (plan.planName === "Gói Tháng") {
                          setShowMonthlyModal(true);
                        } else if (plan.planName === "Gói Năm") {
                          setShowYearlyModal(true);
                        }
                      }
                    }}
                  >
                    {userPlan && plan.planName === userPlan.planName ? "Gói hiện tại của bạn" : "Đăng ký gói"}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="contact-link">
            Có câu hỏi? <a href="#">Liên hệ với chúng tôi</a>
          </div>
        </div>
        <Footer />

        {showMonthlyModal && selectedPlan && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Chọn thời hạn sử dụng</h2>
              <p>
                Bạn đang chọn <strong>{selectedPlan.planName}</strong> giá{" "}
                <strong>{selectedPlan.price.toLocaleString()}đ / tháng</strong>
              </p>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Số tháng:
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    <option value={1}>1 tháng</option>
                    <option value={3}>3 tháng</option>
                    <option value={6}>6 tháng</option>
                    <option value={9}>9 tháng</option>
                  </select>
                </label>
              </div>
              <p>
                Tổng tiền:{" "}
                <strong>
                  {(selectedPlan.price * durationMonths).toLocaleString()}đ
                </strong>
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleVnpayPayment(selectedPlan, durationMonths);
                  setShowMonthlyModal(false);
                }}
              >
                <div className="modal-buttons">
                  <button type="submit" className="btn-secondary">
                    Xác nhận thanh toán
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowMonthlyModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showYearlyModal && selectedPlan && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Xác nhận thanh toán</h2>
              <p>
                Bạn đang chọn <strong>{selectedPlan.planName}</strong> với số tiền{" "}
                <strong>{selectedPlan.price.toLocaleString()}đ</strong>
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleVnpayPayment(selectedPlan, 1); // duration = 1
                  setShowYearlyModal(false);
                }}
              >
                <div className="modal-buttons">
                  <button type="submit" className="btn-secondary">
                    Xác nhận thanh toán
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowYearlyModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
      <ToastNotification
        icon={icon.XCircle}
        message="Bạn đã đăng ký gói dịch vụ này."
        show={toastVisible}
        color="red"
      />
    </>
  );
}

export default ServicePackage;
