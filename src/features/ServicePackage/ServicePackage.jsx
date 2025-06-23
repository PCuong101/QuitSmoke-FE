import React from 'react';
import NavBar from "../../components/NavBar/NavBar"

function ServicePackage() {
    return (
        <>
        <NavBar/>
        
        {/* Thẻ <style> chứa toàn bộ CSS cần thiết cho trang */}
        <style>
            {`
                /* General Body Styles */
                body {
                    background-color: #f7f9fc;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }

                /* Main Container */
                .service-package-container {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 20px;
                    text-align: center;
                }

                /* Header Text */
                .page-title {
                    font-size: 36px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 10px;
                }

                .page-subtitle {
                    font-size: 18px;
                    color: #7f8c8d;
                    margin-bottom: 50px;
                }

                /* Packages Grid */
                .packages-grid {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start; /* Canh các card theo đỉnh */
                    gap: 30px;
                    flex-wrap: wrap; /* Cho phép xuống dòng trên màn hình nhỏ */
                }

                /* Individual Package Card */
                .package-card {
                    background-color: #ffffff;
                    border: 1px solid #e0e6ed;
                    border-radius: 12px;
                    padding: 30px;
                    width: 320px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-direction: column;
                    min-height: 520px; /* Đặt chiều cao tối thiểu để các nút canh đều */
                    position: relative;
                }

                /* Recommended Card Specifics */
                .package-card.recommended {
                    border: 2px solid #28a745;
                    transform: scale(1.02); /* Làm cho nó nổi bật hơn một chút */
                }

                /* Tags for Recommended Card */
                .card-tags {
                    position: absolute;
                    top: -16px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                }

                .tag {
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    color: white;
                }

                .tag.recommended-tag {
                    background-color: #28a745;
                }

                .tag.free-trial-tag {
                    background-color: #007bff;
                }


                /* Card Content */
                .card-header {
                    flex-grow: 1; /* Đẩy button xuống dưới */
                }

                .card-title {
                    font-size: 22px;
                    font-weight: bold;
                    margin-top: 10px;
                    margin-bottom: 15px;
                }

                .card-price {
                    font-size: 42px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                
                .card-price.green {
                    color: #28a745;
                }
                
                .card-price-note {
                    color: #7f8c8d;
                    font-size: 14px;
                    margin-bottom: 30px;
                }

                /* Features List */
                .features-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 30px 0;
                    text-align: left;
                }

                .features-list li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    font-size: 16px;
                    color: #34495e;
                }

                .features-list li::before {
                    content: '✓';
                    color: #28a745;
                    font-weight: bold;
                    font-size: 20px;
                    margin-right: 12px;
                }

                /* Buttons */
                .card-button {
                    width: 100%;
                    padding: 15px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.2s;
                    margin-top: auto; /* Đảm bảo nút luôn ở cuối */
                }
                
                .card-button:hover {
                    transform: translateY(-2px);
                }

                .btn-primary {
                    background-color: #28a745;
                    color: white;
                }
                .btn-primary:hover {
                    background-color: #218838;
                }

                .btn-secondary {
                    background-color: #ffffff;
                    color: #333;
                    border: 1px solid #ccc;
                }
                .btn-secondary:hover {
                    background-color: #f2f2f2;
                }
                
                /* Footer Link */
                .contact-link {
                    margin-top: 50px;
                    font-size: 16px;
                    color: #7f8c8d;
                }

                .contact-link a {
                    color: #28a745;
                    font-weight: bold;
                    text-decoration: none;
                }

                .contact-link a:hover {
                    text-decoration: underline;
                }
            `}
        </style>

        <div className="service-package-container">
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
        </>
    );
}

export default ServicePackage;