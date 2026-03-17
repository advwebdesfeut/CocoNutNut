import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CocoLogo  from '../components/CocoLogo';
import { regions, citiesByRegion, provinces } from '../data/products';
import './AuthPages.css';
import './RegisterExtra.css';

// ── Email validation ───────────────────────────────────────
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());

// ── Password strength ──────────────────────────────────────
const getPassStrength = (pw) => {
  if (!pw) return null;
  const strong = pw.length >= 10 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  const medium = pw.length >= 8  && (/[A-Z]/.test(pw) || /[0-9]/.test(pw));
  if (strong) return 'strong';
  if (medium) return 'medium';
  return 'weak';
};

const INIT = {
  // Name
  firstName: '', middleName: '', lastName: '', extension: '',
  // Contact
  email: '', mobile: '',
  // Password
  password: '', confirmPassword: '',
  // Address
  street: '', barangay: '', city: '', province: '', region: '', zip: '',
};

export default function RegisterPage() {
  const { register }  = useApp();
  const navigate      = useNavigate();
  const [form,   setForm]   = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass]    = useState(false);
  const [showConf, setShowConf]    = useState(false);
  const [step, setStep]            = useState(1); // multi-step wizard
  const TOTAL_STEPS = 3;

  const availableCities = form.region ? (citiesByRegion[form.region] ?? []) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      // Reset city when region changes
      if (name === 'region') next.city = '';
      return next;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── Per-step validation ────────────────────────────────
  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!form.firstName.trim()) errs.firstName = 'First name is required.';
      else if (!/^[A-Za-zÀ-ÿ\s\-']{1,50}$/.test(form.firstName))
        errs.firstName = 'First name contains invalid characters.';

      if (!form.lastName.trim())  errs.lastName  = 'Last name is required.';
      else if (!/^[A-Za-zÀ-ÿ\s\-']{1,50}$/.test(form.lastName))
        errs.lastName = 'Last name contains invalid characters.';

      if (!form.email.trim())     errs.email = 'Email address is required.';
      else if (!validateEmail(form.email)) errs.email = `"${form.email}" is not a valid email address.`;

      const mobile = form.mobile.replace(/\D/g,'');
      if (!form.mobile.trim())    errs.mobile = 'Mobile number is required.';
      else if (!/^(09|\+639)\d{9}$/.test(form.mobile.replace(/\s/g,'')))
        errs.mobile = 'Enter a valid PH mobile number (e.g. 09171234567).';

      if (!form.password)         errs.password = 'Password is required.';
      else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';

      if (!form.confirmPassword)  errs.confirmPassword = 'Please confirm your password.';
      else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    }

    if (s === 2) {
      if (!form.street.trim())   errs.street   = 'Street address is required.';
      if (!form.barangay.trim()) errs.barangay = 'Barangay is required.';
      if (!form.region)          errs.region   = 'Please select a region.';
      if (!form.province)        errs.province = 'Please select a province.';
      if (!form.city.trim())     errs.city     = 'City / Municipality is required.';
    }

    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register({
        firstName: form.firstName, middleName: form.middleName,
        lastName: form.lastName,   extension: form.extension,
        email: form.email, mobile: form.mobile,
        address: {
          street: form.street, barangay: form.barangay,
          city: form.city, province: form.province,
          region: form.region, zip: form.zip,
        },
      });
      navigate('/');
    } catch (err) {
      setErrors({ api: err.message ?? 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPassStrength(form.password);
  const passMatchOK = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="auth-page">
      {/* Left panel */}
      <aside className="auth-panel" aria-hidden="true">
        <div className="auth-panel__content">
          <CocoLogo size={72} />
          <h1>Join CocoNutNut <em>PH</em></h1>
          <p>Create your account and start shopping eco-friendly coconut coir products today.</p>
          <ul className="auth-panel__perks">
            <li>🛒 Easy checkout &amp; order tracking</li>
            <li>📦 Nationwide delivery</li>
            <li>🎁 Exclusive member discounts</li>
            <li>♻️ Eco-points on every purchase</li>
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
            <h2>Create Account</h2>
            <p>Step {step} of {TOTAL_STEPS} — {['Personal Info', 'Address', 'Review'][step-1]}</p>
          </header>

          {/* Progress */}
          <div className="reg-progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`reg-progress__step${i + 1 <= step ? ' active' : ''}`}>
                <div className="reg-progress__dot">{i + 1 <= step ? '✓' : i + 1}</div>
                <span>{['Personal', 'Address', 'Review'][i]}</span>
              </div>
            ))}
          </div>

          {errors.api && (
            <div className="alert alert-error" role="alert">
              <span>⚠</span> {errors.api}
            </div>
          )}

          <form onSubmit={step < TOTAL_STEPS ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} noValidate>

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <div className="auth-form step-content">
                <p className="form-section-title">Full Name</p>

                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label htmlFor="reg-fname" className="form-label">
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      id="reg-fname" name="firstName" type="text"
                      autoComplete="given-name"
                      value={form.firstName} onChange={handleChange}
                      placeholder="e.g. Kobe"
                      className={`form-control${errors.firstName ? ' error' : ''}`}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && <p className="form-error" role="alert">⚠ {errors.firstName}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-mname" className="form-label">Middle Name</label>
                    <input
                      id="reg-mname" name="middleName" type="text"
                      autoComplete="additional-name"
                      value={form.middleName} onChange={handleChange}
                      placeholder="e.g. Bean"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label htmlFor="reg-lname" className="form-label">
                      Last Name <span className="required">*</span>
                    </label>
                    <input
                      id="reg-lname" name="lastName" type="text"
                      autoComplete="family-name"
                      value={form.lastName} onChange={handleChange}
                      placeholder="e.g. Bryant"
                      className={`form-control${errors.lastName ? ' error' : ''}`}
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && <p className="form-error" role="alert">⚠ {errors.lastName}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-ext" className="form-label">Extension</label>
                    <select id="reg-ext" name="extension" value={form.extension} onChange={handleChange} className="form-control">
                      <option value="">None</option>
                      <option>Jr.</option>
                      <option>Sr.</option>
                      <option>II</option>
                      <option>III</option>
                      <option>IV</option>
                    </select>
                  </div>
                </div>

                <p className="form-section-title" style={{ marginTop: 'var(--sp-4)' }}>Contact Details</p>

                <div className="form-group">
                  <label htmlFor="reg-email" className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="reg-email" name="email" type="email"
                    autoComplete="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className={`form-control${errors.email ? ' error' : ''}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'reg-email-err' : undefined}
                  />
                  {errors.email
                    ? <p id="reg-email-err" className="form-error" role="alert">⚠ {errors.email}</p>
                    : form.email && validateEmail(form.email) && (
                        <p className="form-hint" style={{ color: 'var(--clr-success)' }}>✓ Valid email address</p>
                      )
                  }
                </div>

                <div className="form-group">
                  <label htmlFor="reg-mobile" className="form-label">
                    Mobile Number <span className="required">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-addon">🇵🇭 +63</span>
                    <input
                      id="reg-mobile" name="mobile" type="tel"
                      autoComplete="tel"
                      value={form.mobile} onChange={handleChange}
                      placeholder="917 123 4567"
                      className={`form-control${errors.mobile ? ' error' : ''}`}
                      aria-invalid={!!errors.mobile}
                    />
                  </div>
                  {errors.mobile && <p className="form-error" role="alert">⚠ {errors.mobile}</p>}
                  <p className="form-hint">Format: 09171234567 or +63 917 123 4567</p>
                </div>

                <p className="form-section-title" style={{ marginTop: 'var(--sp-4)' }}>Password</p>

                <div className="form-group">
                  <label htmlFor="reg-pass" className="form-label">
                    Password <span className="required">*</span>
                  </label>
                  <div className="input-pass-wrap">
                    <input
                      id="reg-pass" name="password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password} onChange={handleChange}
                      placeholder="At least 8 characters"
                      className={`form-control${errors.password ? ' error' : ''}`}
                      aria-invalid={!!errors.password}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >{showPass ? '🙈' : '👁'}</button>
                  </div>
                  {form.password && strength && (
                    <div>
                      <div className={`pass-strength pass-strength--${strength}`}>
                        <div className="pass-strength__bar" />
                      </div>
                      <p className={`pass-strength-label pass-strength--${strength}`}>
                        Strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
                      </p>
                    </div>
                  )}
                  {errors.password && <p className="form-error" role="alert">⚠ {errors.password}</p>}
                  <p className="form-hint">Min 8 characters. Use uppercase, numbers &amp; symbols for strong password.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-conf" className="form-label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <div className="input-pass-wrap">
                    <input
                      id="reg-conf" name="confirmPassword"
                      type={showConf ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.confirmPassword} onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`form-control${errors.confirmPassword ? ' error' : ''}`}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowConf(s => !s)}
                      aria-label={showConf ? 'Hide password' : 'Show password'}
                    >{showConf ? '🙈' : '👁'}</button>
                  </div>
                  {passMatchOK && <p className="form-hint" style={{ color: 'var(--clr-success)' }}>✓ Passwords match</p>}
                  {errors.confirmPassword && <p className="form-error" role="alert">⚠ {errors.confirmPassword}</p>}
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 'var(--sp-4)' }}>
                  Next: Address →
                </button>
              </div>
            )}

            {/* ── STEP 2: Address ── */}
            {step === 2 && (
              <div className="auth-form step-content">
                <p className="form-section-title">Delivery Address</p>

                <div className="form-group">
                  <label htmlFor="reg-street" className="form-label">
                    Street / Building / House No. <span className="required">*</span>
                  </label>
                  <input
                    id="reg-street" name="street" type="text"
                    autoComplete="street-address"
                    value={form.street} onChange={handleChange}
                    placeholder="e.g. 123 Tomas Morato Street, Apt 4B"
                    className={`form-control${errors.street ? ' error' : ''}`}
                  />
                  {errors.street && <p className="form-error" role="alert">⚠ {errors.street}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="reg-brgy" className="form-label">
                    Barangay <span className="required">*</span>
                  </label>
                  <input
                    id="reg-brgy" name="barangay" type="text"
                    value={form.barangay} onChange={handleChange}
                    placeholder="e.g. Barangay Uno"
                    className={`form-control${errors.barangay ? ' error' : ''}`}
                  />
                  {errors.barangay && <p className="form-error" role="alert">⚠ {errors.barangay}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="reg-region" className="form-label">
                    Region <span className="required">*</span>
                  </label>
                  <select
                    id="reg-region" name="region"
                    value={form.region} onChange={handleChange}
                    className={`form-control${errors.region ? ' error' : ''}`}
                  >
                    <option value="">— Select Region —</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.region && <p className="form-error" role="alert">⚠ {errors.region}</p>}
                </div>

                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label htmlFor="reg-province" className="form-label">
                      Province <span className="required">*</span>
                    </label>
                    <select
                      id="reg-province" name="province"
                      value={form.province} onChange={handleChange}
                      className={`form-control${errors.province ? ' error' : ''}`}
                    >
                      <option value="">— Select Province —</option>
                      {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.province && <p className="form-error" role="alert">⚠ {errors.province}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-city" className="form-label">
                      City / Municipality <span className="required">*</span>
                    </label>
                    {availableCities.length > 0 ? (
                      <select
                        id="reg-city" name="city"
                        value={form.city} onChange={handleChange}
                        className={`form-control${errors.city ? ' error' : ''}`}
                      >
                        <option value="">— Select City —</option>
                        {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input
                        id="reg-city" name="city" type="text"
                        value={form.city} onChange={handleChange}
                        placeholder="e.g. Quezon City"
                        className={`form-control${errors.city ? ' error' : ''}`}
                      />
                    )}
                    {errors.city && <p className="form-error" role="alert">⚠ {errors.city}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-zip" className="form-label">ZIP / Postal Code</label>
                  <input
                    id="reg-zip" name="zip" type="text"
                    value={form.zip} onChange={handleChange}
                    placeholder="e.g. 1100"
                    className="form-control"
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                  />
                </div>

                <div className="reg-nav-btns">
                  <button type="button" className="btn btn-outline" onClick={handleBack}>
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg">
                    Next: Review →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Review & Submit ── */}
            {step === 3 && (
              <div className="auth-form step-content">
                <p className="form-section-title">Review Your Information</p>

                <div className="review-card">
                  <h4>👤 Personal Information</h4>
                  <div className="review-grid">
                    <span className="review-label">Full Name</span>
                    <span>{[form.firstName, form.middleName, form.lastName, form.extension].filter(Boolean).join(' ')}</span>
                    <span className="review-label">Email</span>
                    <span>{form.email}</span>
                    <span className="review-label">Mobile</span>
                    <span>{form.mobile}</span>
                  </div>
                </div>

                <div className="review-card">
                  <h4>📍 Delivery Address</h4>
                  <div className="review-grid">
                    <span className="review-label">Street</span>
                    <span>{form.street}</span>
                    <span className="review-label">Barangay</span>
                    <span>{form.barangay}</span>
                    <span className="review-label">City</span>
                    <span>{form.city}</span>
                    <span className="review-label">Province</span>
                    <span>{form.province}</span>
                    <span className="review-label">Region</span>
                    <span>{form.region}</span>
                    {form.zip && (
                      <>
                        <span className="review-label">ZIP</span>
                        <span>{form.zip}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="alert alert-warning" role="note">
                  <span>ℹ</span>
                  <span>Please review your details before submitting. You can edit them from your profile later.</span>
                </div>

                <div className="reg-nav-btns">
                  <button type="button" className="btn btn-outline" onClick={handleBack}>
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading
                      ? <><span className="spinner" /> Creating Account…</>
                      : '✓ Create Account'
                    }
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-switch__link">Sign In →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
