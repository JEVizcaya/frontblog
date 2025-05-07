import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

function Editor() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [descripcionCompleta, setDescripcionCompleta] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/posts/my/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al obtener posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError('No se pudieron cargar los posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    setUsername(localStorage.getItem('username') || '');
  }, [navigate]);

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este post?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(posts.filter(post => post.id !== id));
      } else {
        alert('Error al borrar el post');
      }
    } catch {
      alert('Error de red');
    }
  };

  const handleAdd = () => {
    navigate('/add');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleVerDescripcion = (descripcion) => {
    setDescripcionCompleta(descripcion);
    setMostrarModal(true);
  };

  if (loading) return <div className="container mt-5">Cargando...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

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

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary">Mis Posts</h2>
          <button className="btn btn-primary" onClick={handleAdd}>Añadir nuevo post</button>
        </div>

        <div className="row">
          {posts.length === 0 ? (
            <div className="alert alert-info">No tienes posts.</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{post.titulo}</h5>
                    <p className="card-text">
                      {post.descripcion.length > 100 ? (
                        <>
                          {post.descripcion.substring(0, 100)}...
                          <i
                            className="bi bi-eye text-info ms-2"
                            style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                            title="Ver más"
                            onClick={() => handleVerDescripcion(post.descripcion)}
                          ></i>
                        </>
                      ) : (
                        post.descripcion
                      )}
                    </p>

                    <div className="mt-auto d-flex justify-content-between">
                      <button className="btn btn-sm btn-warning" onClick={() => handleEdit(post.id)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}>Borrar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL RESPONSIVE */}
      {mostrarModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Descripción completa</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                <p style={{ whiteSpace: 'pre-wrap' }}>{descripcionCompleta}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setMostrarModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Editor;
