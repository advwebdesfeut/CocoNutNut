import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CocoLogo  from '../components/CocoLogo';
import './AuthPages.css';

// ── Email validation (ES2025) ──────────────────────────────
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export default function LoginPage() {
  const { login }  = useApp();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname ?? '/';

  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!validateEmail(form.email)) {
      errs.email = `"${form.email}" is not a valid email address.`;
    }
    if (!form.password) {
      errs.password = 'Password is required.';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.message ?? 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <aside className="auth-panel" aria-hidden="true">
        <div className="auth-panel__content">
          <CocoLogo size={72} />
          <h1>CocoNutNut <em>PH</em></h1>
          <p>Premium eco-friendly coconut coir products, delivered to your door.</p>
          <ul className="auth-panel__perks">
            <li>🌿 100% natural &amp; biodegradable</li>
            <li>🇵🇭 Supporting Filipino farmers</li>
            <li>📦 Nationwide delivery</li>
            <li>⭐ 30-day satisfaction guarantee</li>
          </ul>
        </div>
        <div className="auth-panel__bg" />
      </aside>

      {/* Form */}
      <section className="auth-form-section">
        <div className="auth-form-wrap">
          <header className="auth-form-header">
            <div className="auth-mobile-brand">
              <CocoLogo size={36} />
              <span>CocoNutNut PH</span>
            </div>
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue shopping.</p>
          </header>

          {apiError && (
            <div className="alert alert-error" role="alert">
              <span>⚠</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`form-control${errors.email ? ' error' : ''}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'login-email-err' : undefined}
              />
              {errors.email && (
                <p id="login-email-err" className="form-error" role="alert">
                  <span aria-hidden="true">⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password <span className="required" aria-hidden="true">*</span>
              </label>
              <div className="input-pass-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`form-control${errors.password ? ' error' : ''}`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'login-pass-err' : undefined}
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && (
                <p id="login-pass-err" className="form-error" role="alert">
                  <span aria-hidden="true">⚠</span> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" /> Signing In…</>
                : 'Sign In'
              }
            </button>
          </form>

          <p className="auth-demo-hint">
            <strong>Demo:</strong> Enter any email + password (6+ chars) to log in.
          </p>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch__link">Create one here →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
