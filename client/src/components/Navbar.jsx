import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Hotel, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <Plane size={22} className="brand-icon" />
          <span>TravelEase</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/flights" className={`nav-link ${isActive('/flights') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <Plane size={16} /> Flights
          </Link>
          <Link to="/hotels" className={`nav-link ${isActive('/hotels') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <Hotel size={16} /> Hotels
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <User size={16} /> {user.name.split(' ')[0]}
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}
