import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateCoachPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "COACH",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:8080/api/users", formData);
      setSuccess("Coach created successfully!");
      setTimeout(() => navigate("/admin/coaches"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create coach.");
    }
  };

  return (
    <div className="create-coach-page">
      <h2>Tạo Huấn Luyện Viên Mới</h2>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Họ và tên
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Tạo mới
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/coaches")}
          >
            Hủy
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/admin/coaches")}
          >
            Trang chủ
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoachPage;
