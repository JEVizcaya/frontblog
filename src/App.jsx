import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Editor from './Editor';
import AddPost from './AddPost';
import EditPost from './EditPost';
import PostDetail from './PostDetail';
import { API_BASE_URL } from './config';

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts/`);
        if (!res.ok) throw new Error('Error al obtener posts');
        const data = await res.json();
        setPosts(data);
      } catch {
        setError('No se pudieron cargar los posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Router basename="/blog">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/add" element={<AddPost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/" element={
          <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
              <div className="container">
                <Link className="navbar-brand text-primary fw-bold" to="/">Blog</Link>
                <div className="d-flex">
                  <Link className="btn btn-outline-primary me-2" to="/login">Iniciar Sesión</Link>
                  <Link className="btn btn-primary" to="/register">Registrarse</Link>
                </div>
              </div>
            </nav>
            <div className="container mt-4">
              <header className="mb-4 text-center bg-white p-4 rounded shadow-sm">
                <h1 className="text-primary">Blog de Publicaciones</h1>
                <p className="text-secondary">Explora los últimos posts publicados</p>
              </header>
              {loading ? (
                <div className="text-center">Cargando...</div>
              ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
              ) : (
                <div className="row">
                  {posts.length === 0 ? (
                    <div className="text-center">No hay posts disponibles.</div>
                  ) : posts.map(post => (
                    <div className="col-12 col-md-6 col-lg-4 mb-4" key={post.id}>
                      <div className="card h-100 shadow-sm">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title text-primary fw-bold">{post.titulo}</h5>
                          <p className="card-text text-truncate">{post.descripcion}</p>
                          <div className="mt-auto">
                            <span className="badge bg-secondary">Autor: {post.username}</span>
                          </div>
                          <Link to={`/post/${post.id}`} className="stretched-link"></Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
