// src/components/Sidebar.jsx (PHIÊN BẢN SỬA LỖI CUỐI CÙNG)

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiFileText,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
} from "react-icons/fi";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Các mục điều hướng cho trang admin
  const navItems = [
    { to: "/admin", text: "Bảng điều khiển", icon: <FiGrid size={20} /> },
    { to: "/admin/users", text: "Người dùng", icon: <FiUsers size={20} /> },
    {
      to: "/admin/coaches",
      text: "Huấn luyện viên",
      icon: <FiUserCheck size={20} />,
    },
    {
      to: "/admin/posts",
      text: "Quản lý bài đăng",
      icon: <FiFileText size={20} />,
    },
    // ===================================================================
    // === DÒNG NÀY ĐÃ ĐƯỢC SỬA LẠI CHO ĐÚNG CÚ PHÁP CỦA MỘT OBJECT ===
    // ===================================================================
    {
      to: "/admin/achievements",
      text: "Quản lý Thành tựu",
      icon: <FiAward size={20} />,
    },
    // ===================================================================
    { to: "/admin/settings", text: "Cài đặt", icon: <FiSettings size={20} /> },
  ];

  return (
    <div
      className={`relative bg-blue-800 text-white flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center p-4 border-b border-blue-700 h-16">
        <span
          className={`text-xl font-bold overflow-hidden transition-all ${
            isCollapsed ? "w-0" : "w-full"
          }`}
        >
          Admin Panel
        </span>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto p-2"
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="flex-grow p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-blue-600" : "hover:bg-blue-700"
              }`
            }
          >
            {item.icon}
            {!isCollapsed && (
              <span className="ml-4 whitespace-nowrap">{item.text}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
