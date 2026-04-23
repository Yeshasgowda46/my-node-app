import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); },
    className: `form-input ${errors[field] ? 'error' : ''}`,
  });

  return (
    <div className="auth-page page">
      <div className="container">
        <div className="auth-box card fade-in">
          <div className="auth-header">
            <UserPlus size={32} className="auth-icon" />
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join TravelEase and start exploring</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><User size={13} /> Full Name</label>
              <input {...f('name')} placeholder="John Doe" required />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label"><Mail size={13} /> Email</label>
              <input type="email" {...f('email')} placeholder="you@example.com" required />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label"><Lock size={13} /> Password</label>
              <input type="password" {...f('password')} placeholder="Min 6 characters" required />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label"><Phone size={13} /> Phone (optional)</label>
              <input {...f('phone')} placeholder="+91 98765 43210" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
