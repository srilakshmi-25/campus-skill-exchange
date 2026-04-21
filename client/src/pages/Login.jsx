import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success(`🎉 Welcome back, ${userData.name}!`, { duration: 3000 });
      // Redirect based on role
      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 500);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(`❌ ${msg}`, { duration: 4000 });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', color: '#fff' }}>
            <LogIn size={20} />
          </div>
          <h2 className="heading" style={{ marginBottom: 0 }}>Welcome Back</h2>
        </div>
        <p className="subheading">Enter your email and password to sign in</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Email*
            </label>
            <input
              type="email"
              className="input-field"
              style={{ marginBottom: 0 }}
              placeholder="mail@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Password*
            </label>
            <input
              type="password"
              className="input-field"
              style={{ marginBottom: 0 }}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Not registered yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
