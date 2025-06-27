
import { FiUsers, FiFileText, FiActivity, FiDollarSign } from 'react-icons/fi';

const StatCard = ({ icon, title, value, change }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs text-green-500 mt-2">{change}</p>
    </div>
    <div className="text-3xl text-gray-300">{icon}</div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bảng điều khiển</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FiUsers />} title="Tổng số người dùng" value="1,234" change="+12% so với tháng trước" />
        <StatCard icon={<FiFileText />} title="Số bài đăng blog" value="89" change="+5% so với tháng trước" />
        <StatCard icon={<FiActivity />} title="Người dùng hoạt động (7 ngày)" value="456" change="+8% so với tháng trước" />
        <StatCard icon={<FiDollarSign />} title="Doanh thu tháng này" value="₫12,500,000" change="+15% so với tháng trước" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Hoạt động gần đây */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Hoạt động gần đây</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="h-2.5 w-2.5 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
              <div><p>Người dùng mới đăng ký</p><p className="text-sm text-gray-500">5 phút trước</p></div>
            </li>
            <li className="flex items-start">
              <span className="h-2.5 w-2.5 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
              <div><p>Bài đăng mới được xuất bản</p><p className="text-sm text-gray-500">1 giờ trước</p></div>
            </li>
            <li className="flex items-start">
              <span className="h-2.5 w-2.5 bg-yellow-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
              <div><p>Phản hồi mới từ người dùng</p><p className="text-sm text-gray-500">2 giờ trước</p></div>
            </li>
          </ul>
        </div>
        
        {/* Thống kê tuần này */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Thống kê tuần này</h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center"><p>Người dùng mới</p><p className="font-semibold text-green-600">+45</p></div>
            <div className="flex justify-between items-center"><p>Bài đăng mới</p><p className="font-semibold">12</p></div>
            <div className="flex justify-between items-center"><p>Phản hồi đã giải quyết</p><p className="font-semibold">28</p></div>
            <div className="flex justify-between items-center"><p>Tỷ lệ thành công bỏ thuốc</p><p className="font-semibold text-green-600">68%</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;