// src/layouts/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar'; // Đường dẫn có thể cần điều chỉnh
import Footer from '../components/Footer/Footer'; // Đường dẫn có thể cần điều chỉnh

function MainLayout() {
  return (
    <div className="app-layout">
      {/* NavBar sẽ luôn hiển thị ở trên cùng và chiếm 100% chiều rộng */}
      <NavBar />

      {/* 
        <Outlet /> là một component đặc biệt của React Router.
        Nó hoạt động như một "cửa sổ" nơi các trang con 
        (như Dashboard, Diary, Ranking,...) sẽ được render vào.
      */}
      <main className="main-content-area" style={{ minHeight: '80vh', padding: '20px 0' }}>
        <Outlet />
      </main>

      {/* Footer sẽ luôn hiển thị ở dưới cùng và chiếm 100% chiều rộng */}
      <Footer />
    </div>
  );
}

export default MainLayout;