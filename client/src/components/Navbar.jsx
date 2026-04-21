import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-nav">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }}>
          CS
        </div>
        <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>SkillExchange</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ThemeToggle />
        
        {user ? (
          <>
            <Link to="/matches" style={{ fontWeight: '500' }}>Matches</Link>
            <Link to="/sessions" style={{ fontWeight: '500' }}>Sessions</Link>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
              <User size={18} /> Profile
            </Link>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontWeight: '500' }}>Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
