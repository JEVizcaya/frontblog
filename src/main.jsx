import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { API_BASE_URL } from './config';
import { Link } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand text-primary fw-bold" to="/">Blog</Link>
      </div>
    </nav>
    <App />
  </StrictMode>,
)
