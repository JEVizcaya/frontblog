import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

function EditPost() {
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (!token) {
      navigate('/login');
      return;
    }
    setUsername(storedUsername || '');

    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
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
      const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (loading) return <div className="container mt-5">Cargando...</div>;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand text-primary fw-bold" to="/">Blog</Link>
          <div className="ms-auto d-flex align-items-center">
            <span className="me-3">Bienvenido, <strong>{username}</strong></span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </nav>

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

      {/* Botón Volver centrado */}
      <div className="text-center mt-4">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Volver</button>
      </div>
    </>
  );
}

export default EditPost;
