import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CocoLogo  from './CocoLogo';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount } = useApp();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate   = useNavigate();
  const location   = useLocation();
  const profileRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location.pathname]);

  // Navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/',           label: 'Home'       },
    { to: '/storefront', label: 'Storefront' },
    { to: '/products',   label: 'Products'   },
  ];

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="container">
        <nav className="navbar__inner" role="navigation" aria-label="Main navigation">

          {/* ── Brand ── */}
          <Link to="/" className="navbar__brand" aria-label="CocoFiber PH Home">
            <CocoLogo size={36} />
            <span className="navbar__brand-text">
              Coco<span>NutNut</span> <em>PH</em>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <ul className="navbar__links" role="list">
            {navLinks.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── Desktop actions ── */}
          <div className="navbar__actions">
            {/* Cart */}
            <Link to="/cart" className="navbar__cart-btn" aria-label={`Cart (${cartCount} items)`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9"  cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="navbar__cart-badge" aria-label={`${cartCount} items in cart`}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="navbar__profile" ref={profileRef}>
                <button
                  className="navbar__profile-btn"
                  onClick={() => setProfileOpen(p => !p)}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <span className="navbar__avatar">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                  <span className="navbar__profile-name">{user.firstName}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                    <path d="M6 8L1 3h10z"/>
                  </svg>
                </button>
                {profileOpen && (
                  <div className="navbar__dropdown" role="menu">
                    <Link to="/profile" className="navbar__dropdown-item" role="menuitem">
                      👤 My Profile
                    </Link>
                    <Link to="/history" className="navbar__dropdown-item" role="menuitem">
                      📋 Order History
                    </Link>
                    <Link to="/cart"    className="navbar__dropdown-item" role="menuitem">
                      🛒 My Cart {cartCount > 0 && <span className="badge badge-primary">{cartCount}</span>}
                    </Link>
                    <hr className="navbar__dropdown-divider" />
                    <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger" role="menuitem">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth-btns">
                <Link to="/login"    className="btn btn-outline btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        id="mobile-menu"
        className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="navbar__mobile-links" role="list">
          {navLinks.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/cart" className="navbar__mobile-link">
              Cart
              {cartCount > 0 && (
                <span className="navbar__cart-badge navbar__cart-badge--inline">{cartCount}</span>
              )}
            </Link>
          </li>
        </ul>
        <div className="navbar__mobile-auth">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-outline btn-full">My Profile</Link>
              <Link to="/history" className="btn btn-outline btn-full">Order History</Link>
              <button onClick={handleLogout} className="btn btn-primary btn-full">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline btn-full">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-full">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
