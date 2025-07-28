import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import "./AdminAchievementManager.css";

const API_URL = "http://localhost:8080/api/achievement-templates";

const AchievementForm = ({ isOpen, onClose, onSave, template, logicKeys }) => {
  const CATEGORY_OPTIONS = ["time", "money", "mission", "diary", "health"];
  const [formData, setFormData] = useState({});
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const initialLogicKey = logicKeys.length > 0 ? logicKeys[0] : "";
      if (template) {
        setFormData(template);
        setPreviewUrl(template.iconUrl);
      } else {
        setFormData({
          title: "",
          description: "",
          category: CATEGORY_OPTIONS[0],
          customLogicKey: initialLogicKey,
          threshold: 0,
          visible: true,
        });
        setPreviewUrl(null);
      }
      setIconFile(null);
    }
  }, [isOpen, template, logicKeys]);
  // hàm để xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // hàm để xử lý thay đổi file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ngăn chặn hành động mặc định của form(tải lại trang)
    onSave(formData, iconFile);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-acm" onClick={onClose}>
      <div className="modal-content-acm" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header-acm">
            <h3>{template ? "Chỉnh sửa Thành tựu" : "Tạo Thành tựu mới"}</h3>
            <button
              type="button"
              onClick={onClose}
              className="btn-icon-acm btn-close-modal-acm"
            >
              <X size={24} />
            </button>
          </div>
          <div className="modal-body-acm">
            <div className="form-group-acm">
              <label htmlFor="title">Tiêu đề</label>
              <input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-acm">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                required
                rows="3"
              ></textarea>
            </div>
            <div className="form-grid-acm">
              <div className="form-group-acm">
                <label htmlFor="category">Loại (Category)</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  required
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-acm">
                <label htmlFor="threshold">Ngưỡng (Threshold)</label>
                <input
                  id="threshold"
                  type="number"
                  name="threshold"
                  value={formData.threshold || 0}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group-acm">
              <label htmlFor="customLogicKey">Logic kiểm tra</label>
              <select
                id="customLogicKey"
                name="customLogicKey"
                value={formData.customLogicKey || ""}
                onChange={handleChange}
                required
                disabled={!logicKeys.length}
              >
                {logicKeys.length > 0 ? (
                  logicKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))
                ) : (
                  <option>Đang tải...</option>
                )}
              </select>
            </div>
            <div className="form-group-acm">
              <label>Icon (Tùy chọn)</label>
              <div className="file-input-container-acm">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="icon-preview-acm"
                  />
                )}
                <div className="file-input-wrapper-acm">
                  <ImageIcon size={18} />
                  <span>{iconFile ? iconFile.name : "Chọn file ảnh..."}</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/svg+xml"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer-acm">
            <button
              type="button"
              onClick={onClose}
              className="btn-acm btn-secondary-acm"
            >
              Hủy
            </button>
            <button type="submit" className="btn-acm btn-primary-acm">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Component chính của trang quản lý thành tựu
const AdminAchievementManager = () => {
  const [templates, setTemplates] = useState([]); //mảng lưu trữ các mẫu thành tựu từ API
  const [logicKeys, setLogicKeys] = useState([]); //Mảng, lưu danh sách các logic kiểm tra từ API.
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); //boolean, quản lý trạng thái đóng/mở của modal form.
  const [editingTemplate, setEditingTemplate] = useState(null);

  const fetchData = async () => {//hàm bất đồng bộ (async)
    setIsLoading(true);
    try {
      const templatesRes = await axios.get(API_URL);
      setTemplates(templatesRes.data);

      // Gửi yêu cầu lấy logic keys
      const logicKeysUrl = `${API_URL}/list-logic`;
      const logicKeysRes = await axios.get(logicKeysUrl);
      setLogicKeys(logicKeysRes.data);
    } catch (error) {
      // Log ra lỗi chi tiết hơn
      if (error.response) {
        // Lỗi đến từ server (4xx, 5xx)
        console.error("Lỗi khi tải dữ liệu - Server đã phản hồi:", {
          status: error.response.status,
          data: error.response.data,
          url: error.config.url, // URL nào đã gây ra lỗi
        });
      } else if (error.request) {
        // Yêu cầu đã được gửi nhưng không nhận được phản hồi
        console.error(
          "Lỗi khi tải dữ liệu - Không nhận được phản hồi từ server:",
          error.request
        );
      } else {
        // Lỗi xảy ra khi thiết lập yêu cầu
        console.error(
          "Lỗi khi tải dữ liệu - Lỗi thiết lập yêu cầu:",
          error.message
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
    //Reset editingTemplate về null và mở modal
  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };
// Lưu object template cần sửa vào editingTemplate và mở modal.
  const handleOpenEdit = (template) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };
    //Hàm nhận dữ liệu từ AchievementForm và thực hiện việc gửi API
  const handleSave = async (formData, iconFile) => {
    const data = new FormData();
    data.append(
      "dto",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (iconFile) {
      data.append("icon", iconFile);
    }
    try {
      if (editingTemplate) {
        await axios.put(`${API_URL}/${editingTemplate.templateID}`, formData);
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi lưu:", error.response?.data || error.message);
      alert("Đã có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thành tựu này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Đã có lỗi xảy ra!");
      }
    }
  };

  return (
    <div className="admin-achievement-manager-acm">
      <div className="page-header-acm">
        <h2>Quản lý Thành tựu</h2>
        <button className="btn-acm btn-primary-acm" onClick={handleOpenCreate}>
          <Plus size={18} /> Tạo mới
        </button>
      </div>
      <div className="card-acm">
        {isLoading ? (
          <div className="loading-container-acm">
            <Loader2 className="spinner-acm" />
          </div>
        ) : (
          <table className="data-table-acm">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Loại</th>
                <th>Logic</th>
                <th>Ngưỡng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.templateID}>
                  <td>{template.title}</td>
                  <td>{template.category}</td>
                  <td>{template.customLogicKey}</td>
                  <td>{template.threshold}</td>
                  <td>
                    <div className="action-buttons-acm">
                      <button
                        className="btn-icon-acm"
                        onClick={() => handleOpenEdit(template)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon-acm btn-icon-delete-acm"
                        onClick={() => handleDelete(template.templateID)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AchievementForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        template={editingTemplate}
        logicKeys={logicKeys}
      />
    </div>
  );
};

export default AdminAchievementManager;
