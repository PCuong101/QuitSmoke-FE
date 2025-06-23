// src/BlogManagement.jsx

import React from 'react';
// Import các icon cần thiết
import { Plus, Search, Filter, FilePenLine, Trash2 } from 'lucide-react';

const BlogManagement = () => {
    const posts = [
        { title: '10 Mẹo Vàng Để Bỏ Thuốc Lá Hiệu Quả', author: 'Dr. Trần Minh Tuấn', date: '2024-05-28', category: 'Hướng dẫn', status: 'Đã xuất bản', views: 1250 },
        { title: 'Tác Hại Của Thuốc Lá Đối Với Sức Khỏe', author: 'BS. Nguyễn Thị Lan', date: '2024-05-27', category: 'Y học', status: 'Đã xuất bản', views: 890 },
        { title: 'Câu Chuyện Thành Công: Hành Trình Bỏ Thuốc Củ...', author: 'Admin', date: '2024-05-26', category: 'Câu chuyện', status: 'Bản nháp', views: 0 },
        { title: 'Dinh Dưỡng Hỗ Trợ Quá Trình Bỏ Thuốc', author: 'Th.S Lê Văn Hoàng', date: '2024-05-25', category: 'Dinh dưỡng', status: 'Đã xuất bản', views: 654 },
    ];

    const getStatusClass = (status) => {
        return status === 'Đã xuất bản' ? 'status-published' : 'status-draft';
    };

    const getCategoryClass = (category) => {
        if (category === 'Hướng dẫn') return 'cat-huongdan';
        if (category === 'Y học') return 'cat-yhoc';
        if (category === 'Câu chuyện') return 'cat-cauchuyen';
        if (category === 'Dinh dưỡng') return 'cat-dinhduong';
        return '';
    };

    return (
        <div className="blog-management-page">
            <div className="page-header">
                <h2>Quản lý bài đăng</h2>
                <button className="btn btn-primary">
                    <Plus size={18} strokeWidth={2.5} />
                    <span>Tạo bài đăng mới</span>
                </button>
            </div>

            {/* --- KHU VỰC THỐNG KÊ --- */}
            <div className="stats-grid">
                <div className="card stat-card"><h3>4</h3><p>Tổng bài đăng</p></div>
                <div className="card stat-card"><h3>3</h3><p>Đã xuất bản</p></div>
                <div className="card stat-card"><h3>1</h3><p>Bản nháp</p></div>
                <div className="card stat-card"><h3>2,794</h3><p>Tổng lượt xem</p></div>
            </div>

            {/* --- KHU VỰC BẢNG DỮ LIỆU --- */}
            <div className="card">
                <div className="search-filter-bar">
                    <div className="input-with-icon">
                        <Search className="input-icon" size={20} strokeWidth={2} />
                        <input type="text" placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..." />
                    </div>
                    <button className="btn btn-secondary">
                        <Filter size={16} strokeWidth={2.5} />
                        <span>Bộ lọc</span>
                    </button>
                </div>
                
                <h3 className="list-title">Danh sách bài đăng ({posts.length})</h3>
                
                <div className="data-table">
                    <div className="table-header">
                        <div>Tiêu đề</div>
                        <div>Tác giả</div>
                        <div>Ngày</div>
                        <div>Danh mục</div>
                        <div>Trạng thái</div>
                        <div>Lượt xem</div>
                        <div>Hành động</div>
                    </div>
                    {posts.map((post, index) => (
                        <div className="table-row" key={index}>
                            <div>{post.title}</div>
                            <div>{post.author}</div>
                            <div>{post.date}</div>
                            <div>
                                <span className={`category-tag ${getCategoryClass(post.category)}`}>
                                    {post.category}
                                </span>
                            </div>
                            <div>
                                <span className={`status-tag ${getStatusClass(post.status)}`}>
                                    {post.status}
                                </span>
                            </div>
                            <div>{post.views}</div>
                            <div className="action-buttons">
                                <button className="btn-icon">
                                    <FilePenLine size={18} strokeWidth={1.5} />
                                </button>
                                <button className="btn-icon btn-icon-delete">
                                    <Trash2 size={18} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogManagement;