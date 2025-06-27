import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> {/* Nội dung các trang admin sẽ được render ở đây */}
      </main>
    </div>
  );
};

export default AdminLayout;