import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockTransactions, regions, citiesByRegion, provinces } from '../data/products';
import CocoLogo from '../components/CocoLogo';
import './ProfilePage.css';

const fmt = (n) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export default function ProfilePage() {
  const { user, updateProfile, logout } = useApp();
  const [editing,  setEditing]  = useState(false);
  const [tab,      setTab]      = useState('info');
  const [form,     setForm]     = useState({ ...user, ...user.address });
  const [errors,   setErrors]   = useState({});
  const [saved,    setSaved]    = useState(false);

  const availableCities = form.region ? (citiesByRegion[form.region] ?? []) : [];

  const totalSpent = mockTransactions.reduce((s, t) => s + t.total, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName?.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName?.trim())  errs.lastName  = 'Last name is required.';
    if (!form.email?.trim())     errs.email     = 'Email is required.';
    else if (!validateEmail(form.email)) errs.email = 'Invalid email address.';
    if (!form.mobile?.trim())    errs.mobile    = 'Mobile number is required.';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    updateProfile({
      firstName:  form.firstName,
      middleName: form.middleName,
      lastName:   form.lastName,
      extension:  form.extension,
      email:      form.email,
      mobile:     form.mobile,
      address: {
        street:   form.street,
        barangay: form.barangay,
        city:     form.city,
        province: form.province,
        region:   form.region,
        zip:      form.zip,
      },
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({ ...user, ...user.address });
    setErrors({});
    setEditing(false);
  };

  const fullName = [user.firstName, user.middleName, user.lastName, user.extension].filter(Boolean).join(' ');
  const fullAddr = [user.address?.street, user.address?.barangay, user.address?.city,
                    user.address?.province, user.address?.region].filter(Boolean).join(', ');

  return (
    <div className="profile-page">

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">My Profile</h1>
          <p className="page-hero__subtitle">Manage your account information</p>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <span className="current" aria-current="page">My Profile</span>
          </nav>
        </div>
      </section>

      <div className="profile-main">
        <div className="container">
          <div className="profile-layout">

            {/* ── Sidebar ── */}
            <aside className="profile-sidebar">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar" aria-label="User avatar">
                  <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
                </div>
                <div>
                  <strong className="profile-name">{fullName}</strong>
                  <small className="profile-email">{user.email}</small>
                  <small className="profile-since">Member since {new Date(user.joinDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })}</small>
                </div>
              </div>

              {/* Quick stats */}
              <div className="profile-quick-stats">
                {[
                  { label: 'Total Orders', value: mockTransactions.length },
                  { label: 'Total Spent',  value: fmt(totalSpent)         },
                ].map(s => (
                  <div key={s.label} className="profile-quick-stat">
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Sidebar nav */}
              <nav className="profile-nav" aria-label="Profile sections">
                {[
                  { id: 'info',    label: 'Personal Info',   icon: '👤' },
                  { id: 'address', label: 'My Address',      icon: '📍' },
                  { id: 'orders',  label: 'Recent Orders',   icon: '📦' },
                ].map(n => (
                  <button
                    key={n.id}
                    className={`profile-nav-btn${tab === n.id ? ' active' : ''}`}
                    onClick={() => { setTab(n.id); setEditing(false); }}
                  >
                    <span aria-hidden="true">{n.icon}</span> {n.label}
                  </button>
                ))}
                <Link to="/history" className="profile-nav-btn">
                  <span aria-hidden="true">🗂</span> Full Order History
                </Link>
                <button className="profile-nav-btn profile-nav-btn--danger" onClick={logout}>
                  <span aria-hidden="true">🚪</span> Sign Out
                </button>
              </nav>

              {/* Logo branding */}
              <div className="profile-brand">
                <CocoLogo size={28} />
                <span>CocoFiber PH</span>
              </div>
            </aside>

            {/* ── Main content ── */}
            <div className="profile-content">

              {saved && (
                <div className="alert alert-success" role="status">
                  <span>✓</span> Profile updated successfully!
                </div>
              )}

              {/* ── TAB: Personal Info ── */}
              {tab === 'info' && (
                <section className="profile-card" aria-labelledby="info-heading">
                  <div className="profile-card__header">
                    <h2 id="info-heading">Personal Information</h2>
                    {!editing && (
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                        ✏️ Edit
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <div className="profile-edit-form">
                      <div className="form-row form-row-2">
                        <div className="form-group">
                          <label htmlFor="pf-fname" className="form-label">First Name <span className="required">*</span></label>
                          <input id="pf-fname" name="firstName" type="text" value={form.firstName ?? ''} onChange={handleChange}
                            className={`form-control${errors.firstName ? ' error' : ''}`} />
                          {errors.firstName && <p className="form-error">⚠ {errors.firstName}</p>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="pf-mname" className="form-label">Middle Name</label>
                          <input id="pf-mname" name="middleName" type="text" value={form.middleName ?? ''} onChange={handleChange} className="form-control" />
                        </div>
                      </div>
                      <div className="form-row form-row-2">
                        <div className="form-group">
                          <label htmlFor="pf-lname" className="form-label">Last Name <span className="required">*</span></label>
                          <input id="pf-lname" name="lastName" type="text" value={form.lastName ?? ''} onChange={handleChange}
                            className={`form-control${errors.lastName ? ' error' : ''}`} />
                          {errors.lastName && <p className="form-error">⚠ {errors.lastName}</p>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="pf-ext" className="form-label">Extension</label>
                          <select id="pf-ext" name="extension" value={form.extension ?? ''} onChange={handleChange} className="form-control">
                            <option value="">None</option>
                            <option>Jr.</option><option>Sr.</option>
                            <option>II</option><option>III</option><option>IV</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="pf-email" className="form-label">Email <span className="required">*</span></label>
                        <input id="pf-email" name="email" type="email" value={form.email ?? ''} onChange={handleChange}
                          className={`form-control${errors.email ? ' error' : ''}`} />
                        {errors.email && <p className="form-error">⚠ {errors.email}</p>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="pf-mobile" className="form-label">Mobile <span className="required">*</span></label>
                        <input id="pf-mobile" name="mobile" type="tel" value={form.mobile ?? ''} onChange={handleChange}
                          className={`form-control${errors.mobile ? ' error' : ''}`} />
                        {errors.mobile && <p className="form-error">⚠ {errors.mobile}</p>}
                      </div>
                      <div className="profile-edit-btns">
                        <button className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <dl className="profile-info-list">
                      {[
                        { label: 'Full Name',     value: fullName },
                        { label: 'Email Address', value: user.email },
                        { label: 'Mobile Number', value: user.mobile },
                        { label: 'Member Since',  value: new Date(user.joinDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) },
                      ].map(r => (
                        <div key={r.label} className="profile-info-row">
                          <dt>{r.label}</dt>
                          <dd>{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </section>
              )}

              {/* ── TAB: Address ── */}
              {tab === 'address' && (
                <section className="profile-card" aria-labelledby="addr-heading">
                  <div className="profile-card__header">
                    <h2 id="addr-heading">Delivery Address</h2>
                    {!editing && (
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                        ✏️ Edit
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <div className="profile-edit-form">
                      <div className="form-group">
                        <label htmlFor="pf-street" className="form-label">Street / House No. <span className="required">*</span></label>
                        <input id="pf-street" name="street" type="text" value={form.street ?? ''} onChange={handleChange}
                          className="form-control" placeholder="e.g. 123 Rizal Street" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pf-brgy" className="form-label">Barangay <span className="required">*</span></label>
                        <input id="pf-brgy" name="barangay" type="text" value={form.barangay ?? ''} onChange={handleChange}
                          className="form-control" placeholder="e.g. Barangay Uno" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pf-region" className="form-label">Region</label>
                        <select id="pf-region" name="region" value={form.region ?? ''} onChange={handleChange} className="form-control">
                          <option value="">— Select Region —</option>
                          {regions.map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="form-row form-row-2">
                        <div className="form-group">
                          <label htmlFor="pf-province" className="form-label">Province</label>
                          <select id="pf-province" name="province" value={form.province ?? ''} onChange={handleChange} className="form-control">
                            <option value="">— Select Province —</option>
                            {provinces.map(p => <option key={p}>{p}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="pf-city" className="form-label">City / Municipality</label>
                          {availableCities.length > 0 ? (
                            <select id="pf-city" name="city" value={form.city ?? ''} onChange={handleChange} className="form-control">
                              <option value="">— Select City —</option>
                              {availableCities.map(c => <option key={c}>{c}</option>)}
                            </select>
                          ) : (
                            <input id="pf-city" name="city" type="text" value={form.city ?? ''} onChange={handleChange}
                              className="form-control" placeholder="e.g. Quezon City" />
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="pf-zip" className="form-label">ZIP / Postal Code</label>
                        <input id="pf-zip" name="zip" type="text" value={form.zip ?? ''} onChange={handleChange}
                          className="form-control" placeholder="e.g. 1100" maxLength={4} />
                      </div>
                      <div className="profile-edit-btns">
                        <button className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <dl className="profile-info-list">
                      {[
                        { label: 'Street',   value: user.address?.street   || '—' },
                        { label: 'Barangay', value: user.address?.barangay || '—' },
                        { label: 'City',     value: user.address?.city     || '—' },
                        { label: 'Province', value: user.address?.province || '—' },
                        { label: 'Region',   value: user.address?.region   || '—' },
                        { label: 'ZIP Code', value: user.address?.zip      || '—' },
                      ].map(r => (
                        <div key={r.label} className="profile-info-row">
                          <dt>{r.label}</dt>
                          <dd>{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </section>
              )}

              {/* ── TAB: Recent Orders ── */}
              {tab === 'orders' && (
                <section className="profile-card" aria-labelledby="orders-heading">
                  <div className="profile-card__header">
                    <h2 id="orders-heading">Recent Orders</h2>
                    <Link to="/history" className="btn btn-outline btn-sm">View All</Link>
                  </div>
                  <div className="profile-orders-list">
                    {mockTransactions.slice(0, 3).map(tx => (
                      <div key={tx.id} className="profile-order-row">
                        <div className="profile-order-info">
                          <strong>{tx.id}</strong>
                          <small>{new Date(tx.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
                        </div>
                        <div className="profile-order-meta">
                          <span className={`badge ${tx.status === 'Delivered' ? 'badge-success' : 'badge-info'}`}>
                            {tx.status}
                          </span>
                          <strong>{fmt(tx.total)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
