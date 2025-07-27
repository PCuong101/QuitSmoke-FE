
import { useState, useEffect } from "react";
import CoachNavBar from "../../components/NavBar/CoachNavBar";
import Footer from "../../components/Footer/Footer";
import useUserId from "../../hooks/useUserId";
import { useEditor, EditorContent } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
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

import "./CoachBlogManagementPage.css"; 

dayjs.locale("vi");

const StatusBadge = ({ status }) => {
  const statusMap = {
    PENDING: {
      text: "Chờ duyệt",
      icon: <Clock size={14} />,
      className: "status-pending",
    },
    APPROVED: {
      text: "Đã duyệt",
      icon: <CheckCircle size={14} />,
      className: "status-approved",
    },
    REJECTED: {
      text: "Bị từ chối",
      icon: <XCircle size={14} />,
      className: "status-rejected",
    },
  };
  const currentStatus = statusMap[status] || statusMap.PENDING;
  return (
    <span className={`status-badge ${currentStatus.className}`}>
      {currentStatus.icon}
      {currentStatus.text}
    </span>
  );
};

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

function CoachBlogManagementPage() {
  const [activeTab, setActiveTab] = useState("create");
  const coachId = useUserId();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [myBlogs, setMyBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        
        class: "tiptap-editor-content",
        
      },
    },
  });

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    const editorContent = editor.getHTML();
    if (!title || editor.isEmpty) {
      alert("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/blog/${coachId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content: editorContent }),
        }
      );
      if (!response.ok) throw new Error("Tạo bài viết thất bại.");

      alert(
        "Tạo bài viết thành công! Bài viết của bạn đã được gửi đi và đang chờ duyệt."
      );

      setTitle("");
      setContent("");
      editor.commands.clearContent(true);

      await fetchMyBlogsForCoach();
      setActiveTab("my-blogs");
    } catch (error) {
      console.error("Lỗi khi tạo blog:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchMyBlogsForCoach = async () => {
    if (!coachId) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/blog/author/${coachId}`
      );
      if (!response.ok) throw new Error("Không thể tải bài viết của bạn.");
      const data = await response.json();
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMyBlogs(sortedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "my-blogs") {
      fetchMyBlogsForCoach();
    }
  }, [activeTab, coachId]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div className="page-wrapper">
      <CoachNavBar />
      <div className="blog-management-container">
        <header className="page-header">
          <h1>Quản lý Bài viết</h1>
          <p>Tạo và theo dõi các bài viết bạn chia sẻ đến cộng đồng.</p>
        </header>

        <div className="tab-navigation">
          <button
            className={`tab-item ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Tạo bài viết mới
          </button>
          <button
            className={`tab-item ${activeTab === "my-blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("my-blogs")}
          >
            Bài viết của tôi ({myBlogs.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "create" && (
            <form onSubmit={handleCreateBlog} className="create-blog-form">
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
                  {/* EditorContent sẽ render ra element với class 'tiptap-editor-content' */}
                  <EditorContent editor={editor} />
                </div>
              </div>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting || !editor || editor.isEmpty}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đi chờ duyệt"}
              </button>
            </form>
          )}

          {activeTab === "my-blogs" && (
            <div className="my-blogs-list">
              {isLoading ? (
                <p>Đang tải...</p>
              ) : myBlogs.length > 0 ? (
                myBlogs.map((blog) => (
                  <div key={blog.id} className="my-blog-card">
                    <div className="blog-card-info">
                      <h4>{blog.title}</h4>
                      <p>
                        Cập nhật lần cuối:{" "}
                        {dayjs(blog.updatedAt).format(
                          "HH:mm, [ngày] DD/MM/YYYY"
                        )}
                      </p>
                    </div>
                    <StatusBadge status={blog.status} />
                  </div>
                ))
              ) : (
                <p>Bạn chưa có bài viết nào.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoachBlogManagementPage;
