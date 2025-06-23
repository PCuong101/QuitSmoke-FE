// src/Blog.jsx

import { Link } from 'react-router-dom';
import NavBar from "../../components/NavBar/NavBar"
import { articles } from "../Articles/mock-articles";

function ArticleCard({ article }) {
  return (
    // Link sẽ dẫn đến trang chi tiết với slug tương ứng
    <Link to={`/blog/${article.slug}`} className="article-card">
      <img src={article.imageUrl} alt={article.title} className="card-image" />
      <div className="card-content">
        <span className="card-category">{article.category}</span>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-excerpt">{article.excerpt}</p>
        <div className="card-meta">
          <span>{article.author}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

function Blog() {
  return (
    <>
      <NavBar />
      <div className="article-list-page">
        <header className="article-list-header">
          <h1>Góc Chia Sẻ & Động Lực</h1>
          <p>Hành trình vạn dặm bắt đầu từ một bước chân. Hãy cùng đọc, chia sẻ và tiếp lửa cho nhau!</p>
        </header>
        <main className="article-grid">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </main>
      </div>
    </>
  );
}

export default Blog;