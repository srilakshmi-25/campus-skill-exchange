import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('❌ Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password });
      toast.success('🎉 Account created! Set up your skills now.', { duration: 3500 });
      setTimeout(() => navigate('/profile'), 600);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(`❌ ${msg}`, { duration: 4000 });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', color: '#fff' }}>
            <UserPlus size={20} />
          </div>
          <h2 className="heading" style={{ marginBottom: 0 }}>Join the Campus</h2>
        </div>
        <p className="subheading">Start exchanging skills with peers</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Full Name*</label>
            <input type="text" className="input-field" style={{ marginBottom: 0 }} placeholder="Jane Doe"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Campus Email*</label>
            <input type="email" className="input-field" style={{ marginBottom: 0 }} placeholder="mail@campus.edu"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Password*</label>
            <input type="password" className="input-field" style={{ marginBottom: 0 }} placeholder="Min. 6 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary"
            style={{ width: '100%', opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
