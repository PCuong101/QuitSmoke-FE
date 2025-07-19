

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon } from 'lucide-react';
import './AdminAchievementManager.css';

const API_URL = "http://localhost:8080/api/achievement-templates";

const AchievementForm = ({ isOpen, onClose, onSave, template, logicKeys }) => {
    const CATEGORY_OPTIONS = ["time", "money", "mission", "diary", "health"];
    const [formData, setFormData] = useState({});
    const [iconFile, setIconFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const initialLogicKey = logicKeys.length > 0 ? logicKeys[0] : '';
            if (template) {
                setFormData(template);
                setPreviewUrl(template.iconUrl);
            } else {
                setFormData({
                    title: '', description: '', 
                    category: CATEGORY_OPTIONS[0],
                    customLogicKey: initialLogicKey,
                    threshold: 0, visible: true
                });
                setPreviewUrl(null);
            }
            setIconFile(null);
        }
    }, [isOpen, template, logicKeys]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, iconFile);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>{template ? "Chỉnh sửa Thành tựu" : "Tạo Thành tựu mới"}</h3>
                        <button type="button" onClick={onClose} className="btn-icon btn-close-modal"><X size={24}/></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="title">Tiêu đề</label>
                            <input id="title" name="title" value={formData.title || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Mô tả</label>
                            <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required rows="3"></textarea>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="category">Loại (Category)</label>
                                <select id="category" name="category" value={formData.category || ''} onChange={handleChange} required>
                                    {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="threshold">Ngưỡng (Threshold)</label>
                                <input id="threshold" type="number" name="threshold" value={formData.threshold || 0} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="customLogicKey">Logic kiểm tra</label>
                            <select id="customLogicKey" name="customLogicKey" value={formData.customLogicKey || ''} onChange={handleChange} required disabled={!logicKeys.length}>
                                {logicKeys.length > 0 ? 
                                    logicKeys.map(key => <option key={key} value={key}>{key}</option>) : 
                                    <option>Đang tải...</option>
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Icon (Tùy chọn)</label>
                            <div className="file-input-container">
                                {previewUrl && <img src={previewUrl} alt="Preview" className="icon-preview"/>}
                                <div className="file-input-wrapper">
                                    <ImageIcon size={18}/>
                                    <span>{iconFile ? iconFile.name : 'Chọn file ảnh...'}</span>
                                    <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Hủy</button>
                        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminAchievementManager = () => {
    const [templates, setTemplates] = useState([]);
    const [logicKeys, setLogicKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [templatesRes, logicKeysRes] = await Promise.all([
                axios.get(API_URL),
                axios.get(`${API_URL}/list-logic`)
            ]);
            setTemplates(templatesRes.data);
            setLogicKeys(logicKeysRes.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenCreate = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };
    
    const handleOpenEdit = (template) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const handleSave = async (formData, iconFile) => {
        const data = new FormData();
        data.append('dto', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
        if (iconFile) {
            data.append('icon', iconFile);
        }
        try {
            if (editingTemplate) {
                await axios.put(`${API_URL}/${editingTemplate.templateID}`, formData);
            } else {
                await axios.post(API_URL, data, { headers: { 'Content-Type': 'multipart/form-data' } });
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
        <div className="admin-achievement-manager">
            <div className="page-header">
                <h2>Quản lý Thành tựu</h2>
                <button className="btn btn-primary" onClick={handleOpenCreate}><Plus size={18}/> Tạo mới</button>
            </div>
            <div className="card">
                {isLoading ? (
                    <div className="loading-container"><Loader2 className="spinner"/></div>
                ) : (
                    <table className="data-table">
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
                            {templates.map(template => (
                                <tr key={template.templateID}>
                                    <td>{template.title}</td>
                                    <td>{template.category}</td>
                                    <td>{template.customLogicKey}</td>
                                    <td>{template.threshold}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon" onClick={() => handleOpenEdit(template)}><Edit size={16}/></button>
                                            <button className="btn-icon btn-icon-delete" onClick={() => handleDelete(template.templateID)}><Trash2 size={16}/></button>
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