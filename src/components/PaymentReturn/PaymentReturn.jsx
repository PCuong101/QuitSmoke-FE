import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { useLocation } from "react-router-dom";
import "./PaymentReturn.css";

function PaymentReturn() {
  const location = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vnp_ResponseCode = params.get("vnp_ResponseCode");

    if (vnp_ResponseCode === "00") {
      setMessage("🎉 Chúc mừng! Thanh toán của bạn đã thành công.");
    } else {
      setMessage("❌ Thanh toán thất bại hoặc bị huỷ.");
    }
  }, [location]);

  return (
    <div className="payment-return-container">
      <NavBar />
      <div className="payment-return-content">
        <h1>Kết quả thanh toán</h1>
        <p>{message}</p>
        <a href="/" className="btn-secondary">Quay về trang chủ</a>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentReturn;