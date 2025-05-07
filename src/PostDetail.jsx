import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!res.ok) throw new Error('Error al obtener el post');
        const data = await res.json();
        setPost(data);
      } catch {
        setError('No se pudo cargar el post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
        <div className="container">
          <Link className="navbar-brand text-primary fw-bold" to="/">Blog</Link>
        </div>
      </nav>
      <div
        style={{
          backgroundColor: '#333',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h1 className="text-white text-center mb-4">{post.titulo}</h1>
        <p className="text-center mb-4">{post.descripcion}</p>
        <span style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
          Autor: {post.username}
        </span>
      </div>
    </div>
  );
}

export default PostDetail;