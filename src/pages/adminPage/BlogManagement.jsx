// src/pages/admin/BlogManagement.jsx

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  FilePenLine,
  Trash2,
  Check,
  X,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useNavigate } from "react-router-dom";

dayjs.locale("vi");

// Helper component để hiển thị tag trạng thái
const StatusTag = ({ status }) => {
  const statusMap = {
    APPROVED: { text: "Đã xuất bản", className: "status-published" },
    PENDING: { text: "Chờ duyệt", className: "status-pending" },
    REJECTED: { text: "Bị từ chối", className: "status-rejected" },
  };
  const currentStatus = statusMap[status] || statusMap.PENDING;
  return (
    <span className={`status-tag ${currentStatus.className}`}>
      {currentStatus.text}
    </span>
  );
};

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, pending: 0 });
  const [filter, setFilter] = useState("ALL"); // State để lọc: ALL, PENDING, APPROVED, REJECTED
  const navigate = useNavigate();

  // Hàm fetch tất cả bài viết
  const fetchAllBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/blog/all");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách bài viết.");
      }
      const data = await response.json();
      setBlogs(data);

      // Tính toán thống kê
      const total = data.length;
      const published = data.filter((b) => b.status === "APPROVED").length;
      const pending = data.filter((b) => b.status === "PENDING").length;
      setStats({ total, published, pending });
    } catch (error) {
      console.error(error);
      // Hiển thị lỗi cho người dùng (tùy chọn)
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  // Hàm xử lý việc phê duyệt/từ chối
  const handleUpdateStatus = async (blogId, newStatus) => {
    // Xác định endpoint dựa vào hành động
    const action = newStatus === "APPROVED" ? "approve" : "reject";
    const endpointUrl = `http://localhost:8080/api/blog/${blogId}/${action}`;

    try {
      // Thực hiện request PUT, không cần body nữa
      const response = await fetch(endpointUrl, {
        method: "PUT",
        // KHÔNG CẦN headers và body nữa
      });

      if (!response.ok) {
        // Ném lỗi với thông báo cụ thể hơn
        throw new Error(
          `Không thể ${
            action === "approve" ? "phê duyệt" : "từ chối"
          } bài viết.`
        );
      }

      // Cập nhật UI ngay lập tức
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId ? { ...blog, status: newStatus } : blog
        )
      );

      // Cập nhật thống kê
      if (newStatus === "APPROVED") {
        setStats((prev) => ({
          ...prev,
          published: prev.published + 1,
          pending: prev.pending - 1,
        }));
      } else if (newStatus === "REJECTED") {
        setStats((prev) => ({ ...prev, pending: prev.pending - 1 }));
      }

      alert(
        `Bài viết đã được ${
          newStatus === "APPROVED" ? "phê duyệt" : "từ chối"
        } thành công!`
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert(error.message); // Hiển thị thông báo lỗi từ khối try
    }
  };

  // Lọc danh sách bài viết để hiển thị
  const filteredBlogs = blogs.filter((blog) => {
    if (filter === "ALL") return true;
    return blog.status === filter;
  });

  return (
    <div className="blog-management-page">
      <div className="page-header">
        <h2>Quản lý bài đăng</h2>
        {/* Nút này có thể link đến trang tạo bài viết của admin */}
        <button className="btn btn-primary" onClick={() => navigate('/admin/create-blog')}>
            
          <Plus size={18} strokeWidth={2.5} />
          <span>Tạo bài đăng mới</span>
        </button>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <h3>{stats.total}</h3>
          <p>Tổng bài đăng</p>
        </div>
        <div className="card stat-card">
          <h3>{stats.published}</h3>
          <p>Đã xuất bản</p>
        </div>
        <div className="card stat-card">
          <h3>{stats.pending}</h3>
          <p>Chờ duyệt</p>
        </div>
        <div className="card stat-card">
          <h3>...</h3>
          <p>Tổng lượt xem</p>
        </div>
      </div>

      <div className="card">
        <div className="search-filter-bar">
          <div className="input-with-icon">
            <Search className="input-icon" size={20} strokeWidth={2} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
            />
          </div>
          {/* Các nút lọc */}
          <div className="filter-buttons">
            <button
              className={`btn-filter ${filter === "ALL" ? "active" : ""}`}
              onClick={() => setFilter("ALL")}
            >
              Tất cả
            </button>
            <button
              className={`btn-filter ${filter === "PENDING" ? "active" : ""}`}
              onClick={() => setFilter("PENDING")}
            >
              Chờ duyệt
            </button>
            <button
              className={`btn-filter ${filter === "APPROVED" ? "active" : ""}`}
              onClick={() => setFilter("APPROVED")}
            >
              Đã duyệt
            </button>
            <button
              className={`btn-filter ${filter === "REJECTED" ? "active" : ""}`}
              onClick={() => setFilter("REJECTED")}
            >
              Bị từ chối
            </button>
          </div>
        </div>

        <h3 className="list-title">
          Danh sách bài đăng ({filteredBlogs.length})
        </h3>

        <div className="data-table">
          <div className="table-header">
            <div>Tiêu đề</div>
            <div>Tác giả</div>
            <div>Ngày gửi</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>
          {isLoading ? (
            <div className="loading-row">Đang tải dữ liệu...</div>
          ) : (
            filteredBlogs.map((blog) => (
              <div className="table-row" key={blog.id}>
                <div>{blog.title}</div>
                <div>{blog.authorName || "Không xác định"}</div>
                <div>{dayjs(blog.createdAt).format("DD/MM/YYYY")}</div>
                <div>
                  <StatusTag status={blog.status} />
                </div>
                <div className="action-buttons">
                  {/* Chỉ hiển thị nút duyệt/từ chối cho các bài đang chờ */}
                  {blog.status === "PENDING" && (
                    <>
                      <button
                        className="btn-icon btn-icon-approve"
                        title="Phê duyệt"
                        onClick={() => handleUpdateStatus(blog.id, "APPROVED")}
                      >
                        <Check size={18} strokeWidth={2} />
                      </button>
                      <button
                        className="btn-icon btn-icon-reject"
                        title="Từ chối"
                        onClick={() => handleUpdateStatus(blog.id, "REJECTED")}
                      >
                        <X size={18} strokeWidth={2} />
                      </button>
                    </>
                  )}
                  <button
                    className="btn-icon"
                    title="Chỉnh sửa (tính năng tương lai)"
                  >
                    <FilePenLine size={18} strokeWidth={1.5} />
                  </button>
                  <button className="btn btn-icon-delete" >
                    <Trash2 size={18} strokeWidth={1.5} />
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
