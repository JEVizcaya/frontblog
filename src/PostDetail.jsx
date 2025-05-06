import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/posts/${id}`);
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
      <h1 className="text-primary">{post.titulo}</h1>
      <p>{post.descripcion}</p>
      <span className="badge bg-secondary">Autor: {post.username}</span>
    </div>
  );
}

export default PostDetail;