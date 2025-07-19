// src/pages/admin/AdminCreateBlogPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import useUserId from "../../hooks/useUserId"; 
import {
  Clock,
  CheckCircle,
  XCircle,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Image as ImageIcon, 
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";

 

import "../coachPage/CoachBlogManagementPage.css"; 

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar">
      <button
        title="In đậm"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <span className="icon-wrapper">
          <Bold size={18} strokeWidth={2.5} />
        </span>
      </button>
      <button
        title="In nghiêng"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <span className="icon-wrapper">
          <Italic size={18} strokeWidth={2.5} />
        </span>
      </button>
      <button
        title="Gạch ngang"
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <span className="icon-wrapper">
          <Strikethrough size={18} strokeWidth={2.5} />
        </span>
      </button>
      <button
        title="Tiêu đề cấp 2"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <span className="icon-wrapper">
          <Heading2 size={18} strokeWidth={2.5} />
        </span>
      </button>
      <button
        title="Danh sách dấu chấm"
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <span className="icon-wrapper">
          <List size={18} strokeWidth={2.5} />
        </span>
      </button>
      <button
        title="Danh sách đánh số"
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <span className="icon-wrapper">
          <ListOrdered size={18} strokeWidth={2.5} />
        </span>
      </button>
      <button
        title="Trích dẫn"
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <span className="icon-wrapper">
          <Quote size={18} strokeWidth={2.5} />
        </span>
      </button>

      <button
        title="Chèn ảnh"
        type="button"
        onClick={() => {
          const url = window.prompt("Nhập URL hình ảnh:");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        <span className="icon-wrapper">
          <ImageIcon size={18} strokeWidth={2.5} />
        </span>
      </button>
    </div>
  );
};

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const adminId = useUserId(); 

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "", // Bắt đầu với nội dung trống
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editor.getHTML();

    if (!title || editor.isEmpty) {
      alert("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    setIsSubmitting(true);

    const newPostByAdmin = {
      title,
      content,
      
      status: 'APPROVED', 
      // Gắn ID của admin làm tác giả
      authorId: adminId, 
    };

    try {
      
      await axios.post(`http://localhost:8080/api/blog/${adminId}`, newPostByAdmin);
      
      alert('Bài viết đã được tạo và xuất bản thành công!');
      navigate('/admin/posts'); 
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

 
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  

  return (
    <div className="page-wrapper">
      {/* <AdminNavBar /> Hoặc NavBar chung */}
      <div className="blog-management-container">
        <header className="page-header">
          <h1>Tạo bài đăng của Admin</h1>
          <p>Bài viết được tạo ở đây sẽ được xuất bản ngay lập tức.</p>
        </header>

        {/* Form tạo bài viết */}
        <div className="tab-content" style={{ display: 'block' }}>
          <form onSubmit={handleSubmit} className="create-blog-form">
            <div className="form-group">
              <label htmlFor="blog-title">Tiêu đề bài viết</label>
              <input
                type="text"
                id="blog-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Một tiêu đề hấp dẫn..."
                required
              />
            </div>
            <div className="form-group">
              <label>Nội dung</label>
              <div className="rich-text-editor">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || !editor || editor.isEmpty}
            >
              {isSubmitting ? "Đang xuất bản..." : "Xuất bản ngay"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;