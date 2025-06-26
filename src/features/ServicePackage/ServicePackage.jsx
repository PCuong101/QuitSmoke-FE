import React from 'react';
import NavBar from "../../components/NavBar/NavBar"
import Footer from '../../components/Footer/Footer';
import './ServicePackage.css'; // Import CSS styles for the component

function ServicePackage() {
    return (
        <>
        <div className='service-package-container'>
        <NavBar/>

        <div className="service-package-content">
            <h1 className="page-title">Chọn gói dịch vụ</h1>
            <p className="page-subtitle">Chọn gói phù hợp để có trải nghiệm tốt nhất trong hành trình cai thuốc</p>

            <div className="packages-grid">

                {/* --- One-time Purchase Card --- */}
                <div className="package-card">
                     <div className="card-header">
                        <h2 className="card-title">One-time Purchase</h2>
                        <div className="card-price">99,000đ</div>
                        <p className="card-price-note">Mua một lần sử dụng trọn đời</p>
                        <ul className="features-list">
                            <li>Tất cả tính năng Premium</li>
                            <li>Không giới hạn thời gian</li>
                            <li>Backup dữ liệu trọn đời</li>
                            <li>Ưu tiên hỗ trợ</li>
                            <li>Cập nhật miễn phí</li>
                        </ul>
                    </div>
                    <button className="card-button btn-secondary">Mua ngay</button>
                </div>

                {/* --- Free Version Card --- */}
                <div className="package-card">
                     <div className="card-header">
                        <h2 className="card-title">Free Version</h2>
                        <div className="card-price green">Miễn phí</div>
                        <p className="card-price-note">Tiếp tục với phiên bản miễn phí</p>
                        <ul className="features-list">
                            <li>Theo dõi cơ bản</li>
                            <li>Missions giới hạn</li>
                            <li>Chat cộng đồng</li>
                            <li>Quảng cáo</li>
                        </ul>
                    </div>
                    <button className="card-button btn-secondary">Tiếp tục miễn phí</button>
                </div>

            </div>

            <div className="contact-link">
                Có câu hỏi? <a href="#">Liên hệ với chúng tôi</a>
            </div>
        </div>
        <Footer/>
        </div>
        
        </>
    );
}

export default ServicePackage;