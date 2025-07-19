import { useEffect, useState } from "react";
import { Loader2, Trash2, Edit } from "lucide-react";
import "./ServicePackagesAdmin.css";

function ServicePackageAdmin() {
    const [plan, setPlan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [formData, setFormData] = useState({
        planName: "",
        description: "",
        features: "",
        price: 0,
    });

    useEffect(() => {
        setIsLoading(true);
        async function fetchServicePackages() {
            try {
                const response = await fetch("http://localhost:8080/api/member-plans/list");
                if (!response.ok) {
                    throw new Error(response.text());
                }
                const data = await response.json();
                setPlan(data);
            } catch (error) {
                console.error("Error fetching service packages:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchServicePackages();
    }, []);

    const handleOpenEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            planID: plan.planID || "",
            planName: plan.planName || "",
            description: plan.description || "",
            features: plan.features || "",
            price: plan.price || 0,
        });
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) : value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/member-plans/update/${editingPlan.planId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Cập nhật thành công!");
                // Cập nhật lại danh sách gói
                setIsModalOpen(false);
                window.location.reload();
            } else {
                alert("Cập nhật thất bại.");
            }
        } catch (err) {
            console.error("Lỗi:", err);
            alert("Đã xảy ra lỗi.");
        }
    };


    return (
        <div className="admin-achievement-manager-ser">
            <div className="page-header-ser">
                <h2>Quản lý Gói thành viên</h2>
            </div>
            <div className="card-ser">
                {isLoading ? (
                    <div className="loading-container-ser"><Loader2 className="spinner-ser" /></div>
                ) : (
                    <table className="data-table-ser">
                        <thead>
                            <tr>
                                <th>Tên gói</th>
                                <th>Nội dung</th>
                                <th>Tính năng</th>
                                <th>Giá tiền</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plan.map(p => (
                                <tr key={p.planID}>
                                    <td>{p.planName}</td>
                                    <td>{p.description}</td>
                                    <td>{p.features}</td>
                                    <td>
                                        {p.price === 0 ? (
                                            <span className="free-plan-ser">Miễn phí</span>
                                        ) : (
                                            <span className="paid-plan-ser">{p.price.toLocaleString()}đ</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons-ser">
                                            <button className="btn-icon-ser" onClick={() => handleOpenEdit(p)}>
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {isModalOpen && (
                    <div className="modal-overlay-ser">
                        <div className="modal-content-ser">
                            <h3>Chỉnh sửa gói thành viên</h3>
                            <div className="form-row-ser">
                                <label>Tên gói:</label>
                                <input
                                    type="text"
                                    name="planName"
                                    value={formData.planName}
                                    onChange={handleFormChange}
                                    readOnly
                                />
                            </div>
                            <div className="form-row-ser">
                                <label>Mô tả:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    rows="2"
                                />
                            </div>
                            <div className="form-row-ser">
                                <label>Tính năng:</label>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleFormChange}
                                    rows="4"
                                />
                            </div>
                            <div className="form-row-ser">
                                <label>Giá tiền:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="modal-buttons-ser">
                                <button className="save-btn-ser" onClick={handleSave}>Lưu</button>
                                <button className="cancel-btn-ser" onClick={() => setIsModalOpen(false)}>Đóng</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServicePackageAdmin;