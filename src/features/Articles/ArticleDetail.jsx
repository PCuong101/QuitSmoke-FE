// src/ArticleDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from "../../components/NavBar/NavBar"
import { articles } from './mock-articles';
import { ArrowLeft, Share2, Rocket } from 'lucide-react';

function ArticleDetail() {
  const { slug } = useParams(); // Lấy slug từ URL
  const article = articles.find(a => a.slug === slug);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Xử lý thanh tiến trình đọc
  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi mở bài viết mới
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]); // Chạy lại effect khi slug thay đổi

  if (!article) {
    return <div>Bài viết không tồn tại.</div>;
  }

  // Lấy 3 bài viết khác để hiển thị ở cuối
  const relatedArticles = articles.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <>
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      <NavBar />
      <div className="article-detail-page">
        <div className="article-content-wrapper">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={18} /> Quay lại danh sách
          </Link>
          <h1 className="article-detail-title">{article.title}</h1>
          <div className="article-detail-meta">
            <span>Bởi <strong>{article.author}</strong></span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <img src={article.imageUrl} alt={article.title} className="article-detail-image" />

          {/* Hiển thị nội dung HTML từ mock data */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="article-footer">
            <div className="share-buttons">
              <span>Chia sẻ:</span>
              <button><Share2 size={20} /></button>
            </div>
            <Link to="/missions" className="cta-button">
              <Rocket size={20} /> Bắt đầu nhiệm vụ hôm nay!
            </Link>
          </div>

          <div className="related-articles">
              <h2>Bài viết liên quan</h2>
              <div className="related-grid">
                  {relatedArticles.map(rel => (
                      <Link key={rel.id} to={`/blog/${rel.slug}`} className="related-card">
                           <img src={rel.imageUrl} alt={rel.title} />
                           <h3>{rel.title}</h3>
                      </Link>
                  ))}
              </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArticleDetail;