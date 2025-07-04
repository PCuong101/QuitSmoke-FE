import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import "./ServicePackage.css";
import { useUser } from "../../contexts/UserContext";

function ServicePackage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const { email, userId } = useUser();

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
  }, []);

  async function handleVnpayPayment(plan) {
    try {
      const response = await fetch("http://localhost:8080/api/payment/vnpay/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: plan.price,
          email: email,
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
                    className="card-button btn-secondary"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowModal(true);
                    }}
                  >
                    Mua ngay
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

        {showModal && selectedPlan && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Thanh toán qua VNPay</h2>
              <p>
                Bạn đang chọn <strong>{selectedPlan.planName}</strong> với số tiền{" "}
                <strong>{selectedPlan.price.toLocaleString()}đ</strong>
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleVnpayPayment(selectedPlan);
                  setShowModal(false);
                }}
              >
                <div className="modal-buttons">
                  <button type="submit" className="btn-secondary">
                    Xác nhận thanh toán
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ServicePackage;
