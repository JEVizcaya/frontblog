import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('No se pudo cargar el post');
        const data = await res.json();
        setForm({ titulo: data.titulo, descripcion: data.descripcion });
      } catch {
        setMessage('Error al cargar el post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage('Post actualizado con éxito');
        setTimeout(() => navigate('/editor'), 1000);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Error al actualizar el post');
      }
    } catch {
      setMessage('Error de red');
    }
  };

  if (loading) return <div className="container mt-5">Cargando...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center text-warning">Editar Post</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-white">
        <div className="mb-3">
          <input name="titulo" className="form-control form-control-lg" placeholder="Título" value={form.titulo} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <textarea name="descripcion" className="form-control form-control-lg" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required rows={4} />
        </div>
        <button type="submit" className="btn btn-warning btn-lg w-100">Actualizar Post</button>
      </form>
      {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
    </div>
  );
}

export default EditPost;
