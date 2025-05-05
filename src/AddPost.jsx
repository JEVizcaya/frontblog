import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const res = await fetch('http://localhost:3001/api/posts', {
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
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Nuevo Post</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
        <div className="mb-3">
          <input name="titulo" className="form-control" placeholder="Título" value={form.titulo} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <textarea name="descripcion" className="form-control" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required rows={4} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Crear Post</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default AddPost;
