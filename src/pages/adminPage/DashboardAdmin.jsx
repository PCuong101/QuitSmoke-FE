import React from 'react';
import { Users, FileText, Activity, DollarSign } from 'lucide-react';

const DashboardAdmin = () => {
  return (
    // Bọc toàn bộ trang trong div với class "dashboard-page"
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Bảng điều khiển</h2>
      </div>
      
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-header">
            <p>Tổng số người dùng</p>
            <Users className="stat-icon" size={22} strokeWidth={1.5} />
          </div>
          <h3>1,234</h3>
          <span className="increase">+12% so với tháng trước</span>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <p>Số bài đăng blog</p>
            <FileText className="stat-icon" size={22} strokeWidth={1.5} />
          </div>
          <h3>89</h3>
          <span className="increase">+5% so với tháng trước</span>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <p>Người dùng hoạt động (7 ngày)</p>
            <Activity className="stat-icon" size={22} strokeWidth={1.5} />
          </div>
          <h3>456</h3>
          <span className="increase">+8% so với tháng trước</span>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <p>Doanh thu tháng này</p>
            <DollarSign className="stat-icon" size={22} strokeWidth={1.5} />
          </div>
          <h3>₫12,500,000</h3>
          <span className="increase">+15% so với tháng trước</span>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="card recent-activity">
          <h3>Hoạt động gần đây</h3>
          <ul>
            <li><span className="dot green"></span><div><p>Người dùng mới đăng ký</p><small>5 phút trước</small></div></li>
            <li><span className="dot blue"></span><div><p>Bài đăng mới được xuất bản</p><small>1 giờ trước</small></div></li>
            <li><span className="dot orange"></span><div><p>Phản hồi mới từ người dùng</p><small>2 giờ trước</small></div></li>
          </ul>
        </div>
        <div className="card weekly-stats">
          <h3>Thống kê tuần này</h3>
          <ul>
            <li><span>Người dùng mới</span><span>+45</span></li>
            <li><span>Bài đăng mới</span><span>12</span></li>
            <li><span>Phản hồi đã giải quyết</span><span>28</span></li>
            <li><span>Tỷ lệ thành công bỏ thuốc</span><span className="percentage">68%</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;