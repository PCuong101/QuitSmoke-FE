import React, { useState, useEffect } from 'react';
import { Users, FileText, Activity, DollarSign, AlertCircle } from 'lucide-react';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    blogPosts: 0, // Giá trị ban đầu là 0
    activeUsers: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. TẠO CÁC PROMISE CHO CÁC CUỘC GỌI API
        const usersPromise = fetch('http://localhost:8080/api/users', {
          method: 'GET',
        });
        const blogPostsPromise = fetch('http://localhost:8080/api/blog/all', {
          method: 'GET',
        });

        // 2. SỬ DỤNG PROMISE.ALL ĐỂ THỰC THI ĐỒNG THỜI
        const [usersResponse, blogPostsResponse] = await Promise.all([
          usersPromise,
          blogPostsPromise,
        ]);

        // 3. XỬ LÝ KẾT QUẢ CỦA TỪNG API
        
        // Xử lý users và tính doanh thu
        if (!usersResponse.ok) {
          throw new Error('Không thể tải dữ liệu người dùng từ server.');
        }
        const users = await usersResponse.json();
        const regularUsersCount = users.filter(user => user.role !== 'ADMIN').length;
        const vipUsersCount = users.filter(user => user.role === 'MEMBER_VIP1').length;
        const pricePerVip = 299000;
        const calculatedRevenue = vipUsersCount * pricePerVip;

        // Xử lý blog posts
        if (!blogPostsResponse.ok) {
          throw new Error('Không thể tải dữ liệu bài viết từ server.');
        }
        const blogPosts = await blogPostsResponse.json();
        // Giả sử API trả về một mảng, chúng ta lấy độ dài của nó
        const blogPostsCount = blogPosts.length;

        // 4. CẬP NHẬT STATE VỚI TẤT CẢ DỮ LIỆU MỚI
        setStats(prevStats => ({
          ...prevStats,
          totalUsers: regularUsersCount,
          monthlyRevenue: calculatedRevenue,
          blogPosts: blogPostsCount, // Cập nhật số lượng bài viết
        }));

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="dashboard-page">
         <div className="page-header">
            <h2>Bảng điều khiển</h2>
         </div>
         <div className="error-message-container">
            <AlertCircle color="red" size={48} />
            <h3>Đã xảy ra lỗi</h3>
            <p>{error}</p>
         </div>
      </div>
    )
  }

  return (
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
          <h3>{loading ? '...' : stats.totalUsers.toLocaleString('vi-VN')}</h3>
          {/* <span className="increase">+12% so với tháng trước</span> */}
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <p>Số bài đăng blog</p>
            <FileText className="stat-icon" size={22} strokeWidth={1.5} />
          </div>
          <h3>{loading ? '...' : stats.blogPosts.toLocaleString('vi-VN')}</h3>
          {/* <span className="increase">+5% so với tháng trước</span> */}
        </div>
        
        <div className="card stat-card">
          <div className="stat-header">
            <p>Doanh thu tháng này</p>
            <DollarSign className="stat-icon" size={22} strokeWidth={1.5} />
          </div>
          <h3>
            {loading ? 'Đang tính...' : `${stats.monthlyRevenue.toLocaleString('vi-VN')} đ`}
          </h3>
          {/* <span className="increase">+15% so với tháng trước</span> */}
        </div>
      </div>

      <div className="dashboard-panels">
        {/* <div className="card recent-activity">
          <h3>Hoạt động gần đây</h3>
          <ul>
            <li><span className="dot green"></span><div><p>Người dùng mới đăng ký</p><small>5 phút trước</small></div></li>
            <li><span className="dot blue"></span><div><p>Bài đăng mới được xuất bản</p><small>1 giờ trước</small></div></li>
            <li><span className="dot orange"></span><div><p>Phản hồi mới từ người dùng</p><small>2 giờ trước</small></div></li>
          </ul>
        </div> */}
        {/* <div className="card weekly-stats">
          <h3>Thống kê tuần này</h3>
          <ul>
            <li><span>Người dùng mới</span><span>+45</span></li>
            <li><span>Bài đăng mới</span><span>12</span></li>
            <li><span>Phản hồi đã giải quyết</span><span>28</span></li>
            <li><span>Tỷ lệ thành công bỏ thuốc</span><span className="percentage">68%</span></li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardAdmin;