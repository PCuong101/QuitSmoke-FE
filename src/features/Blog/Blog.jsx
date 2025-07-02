// src/features/Blog/Blog.jsx (Đã nâng cấp)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from "../../components/NavBar/NavBar";
import dayjs from "dayjs";

// Component con giữ nguyên cấu trúc, nhưng sẽ nhận props từ API
function ArticleCard({ article }) {
  // Hàm tạo excerpt ngắn gọn
  const createExcerpt = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    return doc.body.textContent.slice(0, 150) + '...' || "";
  }

  return (
    <Link to={`/blog/${article.id}`} className="article-card">
      <img src={`https://picsum.photos/seed/${article.id}/800/400`} alt={article.title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{article.title}</h3>
        <p className="card-excerpt">{createExcerpt(article.content)}</p>
        <div className="card-meta">
          <span>{article.authorName}</span>
          <span>•</span>
          <span>{dayjs(article.createdAt).format("DD/MM/YYYY")}</span>
        </div>
      </div>
    </Link>
  );
}

function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicArticles = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/blog/public");
            if (!response.ok) throw new Error("Lỗi tải bài viết");
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchPublicArticles();
  }, []);

  return (
    <>
      <NavBar />
      <div className="article-list-page">
        <header className="article-list-header">
          <h1>Góc Chia Sẻ & Động Lực</h1>
          <p>Hành trình vạn dặm bắt đầu từ một bước chân. Hãy cùng đọc, chia sẻ và tiếp lửa cho nhau!</p>
        </header>
        <main className="article-grid">
          {loading ? <p>Đang tải bài viết...</p> : (
            articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </main>
      </div>
    </>
  );
}

export default Blog;