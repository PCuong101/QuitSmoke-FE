import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from "../../components/NavBar/NavBar";
import { ArrowLeft } from 'lucide-react';
import dayjs from 'dayjs';

function ArticleDetail() {
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchArticle = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/blog/${id}`);
            if (!response.ok) throw new Error("Không tìm thấy bài viết");
            const data = await response.json();
            setArticle(data);
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div>Đang tải bài viết...</div>;
  }

  if (!article) {
    return <div>Bài viết không tồn tại.</div>;
  }

  return (
    <>
      <NavBar />
      <div className="article-detail-page">
        <div className="article-content-wrapper">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={18} /> Quay lại danh sách
          </Link>
          <h1 className="article-detail-title">{article.title}</h1>
          <div className="article-detail-meta">
            <span>Bởi <strong>{article.authorName}</strong></span>
            <span>•</span>
            <span>{dayjs(article.createdAt).format("DD/MM/YYYY")}</span>
          </div>
          {/* <img src={`https://picsum.photos/seed/${article.id}/1200/600`} alt={article.title} className="article-detail-image" /> */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </>
  );
}

export default ArticleDetail;