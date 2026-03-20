import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './CartPage.css';

const fmt = (n) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
const SHIPPING_FREE_THRESHOLD = 1500;
const SHIPPING_FEE = 120;

export default function CartPage() {
  const { cartItems, cartSubtotal, removeFromCart, updateQty, user } = useApp();
  const navigate = useNavigate();

  const shippingFee  = cartSubtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE;
  const orderTotal   = cartSubtotal + shippingFee;
  const freeShipLeft = Math.max(0, SHIPPING_FREE_THRESHOLD - cartSubtotal);
  const freeShipPct  = Math.min(100, (cartSubtotal / SHIPPING_FREE_THRESHOLD) * 100);

  const handleCheckout = () => {
    if (!user) { navigate('/login', { state: { from: { pathname: '/checkout' } } }); return; }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">My Cart</h1>
          <p className="page-hero__subtitle">
            {cartItems.length === 0
              ? 'Your cart is empty'
              : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`}
          </p>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <Link to="/products">Products</Link>
            <span className="sep">›</span>
            <span className="current" aria-current="page">Cart</span>
          </nav>
        </div>
      </section>

      <div className="cart-main">
        <div className="container">

          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🛒</div>
              <h2 className="empty-state__title">Your Cart Is Empty</h2>
              <p className="empty-state__text">
                You haven't added any products yet. Browse our eco-friendly collection!
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
            </div>
          ) : (
            <div className="cart-layout">

              {/* ── Cart Items ── */}
              <section className="cart-items" aria-label="Cart items">

                {/* Free shipping progress */}
                {freeShipLeft > 0 ? (
                  <div className="ship-progress">
                    <p>
                      Add <strong>{fmt(freeShipLeft)}</strong> more to get{' '}
                      <strong style={{ color: 'var(--clr-success)' }}>FREE shipping</strong>! 🚚
                    </p>
                    <div className="ship-progress__bar">
                      <div
                        className="ship-progress__fill"
                        style={{ width: `${freeShipPct}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(freeShipPct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-success" role="status">
                    <span>🎉</span>
                    <span>You've unlocked <strong>FREE shipping</strong> on this order!</span>
                  </div>
                )}

                <ul className="cart-list">
                  {cartItems.map(item => (
                    <li key={item.id} className="cart-item">
                      <div className="cart-item__img-wrap">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          width="100"
                          height="80"
                        />
                      </div>

                      <div className="cart-item__info">
                        <h3 className="cart-item__name">{item.name}</h3>
                        <p className="cart-item__meta">
                          {item.badge && (
                            <span className={`badge badge-${item.badge === 'bestseller' ? 'danger' : item.badge === 'new' ? 'success' : 'warning'}`}>
                              {item.badge}
                            </span>
                          )}
                          <span className="text-muted">Unit: {fmt(item.price)}</span>
                        </p>

                        <div className="cart-item__controls">
                          <div className="qty-stepper" role="group" aria-label="Quantity">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              aria-label="Decrease quantity"
                              disabled={item.qty <= 1}
                            >−</button>
                            <span aria-live="polite" aria-label={`Quantity: ${item.qty}`}>{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              aria-label="Increase quantity"
                              disabled={item.qty >= item.stock}
                            >+</button>
                          </div>

                          <button
                            className="cart-item__remove"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </div>

                      <div className="cart-item__price">
                        <strong>{fmt(item.price * item.qty)}</strong>
                        {item.qty > 1 && (
                          <small>{item.qty} × {fmt(item.price)}</small>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="cart-actions">
                  <Link to="/products" className="btn btn-outline">
                    ← Continue Shopping
                  </Link>
                </div>
              </section>

              {/* ── Order Summary ── */}
              <aside className="cart-summary" aria-label="Order summary">
                <div className="cart-summary__inner">
                  <h2 className="cart-summary__title">Order Summary</h2>

                  <dl className="summary-list">
                    <div className="summary-row">
                      <dt>Subtotal ({cartItems.reduce((s,i)=>s+i.qty,0)} items)</dt>
                      <dd>{fmt(cartSubtotal)}</dd>
                    </div>
                    <div className="summary-row">
                      <dt>Shipping Fee</dt>
                      <dd className={shippingFee === 0 ? 'text-success' : ''}>
                        {shippingFee === 0 ? 'FREE' : fmt(shippingFee)}
                      </dd>
                    </div>
                    {shippingFee > 0 && (
                      <div className="summary-row summary-row--hint">
                        <dt colSpan={2}>
                          <small>Free shipping on orders ₱{SHIPPING_FREE_THRESHOLD.toLocaleString()}+</small>
                        </dt>
                      </div>
                    )}
                    <div className="summary-divider" />
                    <div className="summary-row summary-row--total">
                      <dt>Total</dt>
                      <dd>{fmt(orderTotal)}</dd>
                    </div>
                  </dl>

                  <button
                    className="btn btn-primary btn-full btn-lg"
                    onClick={handleCheckout}
                  >
                    {user ? 'Proceed to Checkout →' : 'Sign In to Checkout'}
                  </button>

                  {!user && (
                    <p className="cart-summary__auth-hint">
                      <Link to="/register">Create an account</Link> to save your cart.
                    </p>
                  )}

                  <div className="cart-summary__trust">
                    <span>🔒 Secure Checkout</span>
                    <span>♻️ Eco-Friendly</span>
                    <span>📦 Free Returns</span>
                  </div>
                </div>
              </aside>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
