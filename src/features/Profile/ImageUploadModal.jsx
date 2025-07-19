// src/features/Profile/ImageUploadModal.jsx

import React, { useState, useRef } from 'react';
import { ImageUp, X, Upload } from 'lucide-react';
import './ImageUploadModal.css'; 

const ImageUploadModal = ({ isOpen, onClose, onImageSelect, currentImageUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi người dùng nhấn nút "Lưu thay đổi"
  const handleConfirmSelection = () => {
    if (selectedFile) {
      onImageSelect(selectedFile); 
      onClose(); // Đóng modal
    }
  };

  // Mở cửa sổ chọn file khi nhấn vào khu vực upload
  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  // Nếu modal không mở, không render gì cả
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-upl" onClick={onClose}>
      <div className="modal-content-upl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-upl">
          <h2>Chọn ảnh đại diện</h2>
          <button className="modal-close-btn-upl" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body-upl">
          <div className="upload-area-upl" onClick={handleUploadAreaClick}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            {preview ? (
              <img src={preview} alt="Xem trước" className="image-preview-upl" />
            ) : (
              <div className="upload-placeholder-upl">
                <ImageUp size={48} />
                <span>Nhấp để tải ảnh lên</span>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer-upl">
          <button className="btn-upl btn-secondary-upl" onClick={onClose}>
            Hủy
          </button>
          <button 
            className="btn-upl btn-primary-upl" 
            onClick={handleConfirmSelection}  
            disabled={!selectedFile}
          >
            <Upload size={16} style={{ marginRight: '8px' }}/>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;