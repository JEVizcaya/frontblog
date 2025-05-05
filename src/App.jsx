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

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/posts/');
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
    <Router>
      
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/add" element={<AddPost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/" element={
          <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
              <Link to="/login" className="btn btn-outline-primary">Acceso Login</Link>
            </div>
            <h1 className="mb-4">Todos los posts</h1>
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="row">
                {posts.length === 0 ? (
                  <div>No hay posts disponibles.</div>
                ) : posts.map(post => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={post.id}>
                    <div className="card h-100">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title text-primary fw-bold">{post.titulo}</h5>
                        <p className="card-text">{post.descripcion}</p>
                        <div className="mt-auto">
                          <span className="badge bg-secondary">Autor: {post.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
