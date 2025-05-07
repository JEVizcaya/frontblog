import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

function AddPost() {
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No autenticado');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage('Post creado con éxito');
        setTimeout(() => navigate('/editor'), 1000);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Error al crear el post');
      }
    } catch {
      setMessage('Error de red');
    }
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand text-primary fw-bold" to="/">Blog</Link>
        </div>
      </nav>

      <div className="container mt-5" style={{ maxWidth: '600px' }}>
        <h2 className="mb-4 text-center text-primary">Crear Nuevo Post</h2>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
          <div className="mb-3">
            <input
              name="titulo"
              className="form-control form-control-lg"
              placeholder="Título del Post"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              name="descripcion"
              className="form-control form-control-lg"
              placeholder="Contenido del Post"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows={6}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100">Publicar</button>
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

export default AddPost;
