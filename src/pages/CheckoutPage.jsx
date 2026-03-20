import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './CheckoutPage.css';

const fmt = (n) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
const SHIPPING_FREE_THRESHOLD = 1500;
const DELIVERY_FEE = 120;
const PICKUP_ADDRESS = '123 Coco Lane, Quezon City, Metro Manila';

const PAYMENT_METHODS = [
  { id: 'gcash',   label: 'GCash',               icon: '💙', desc: 'Pay via GCash e-wallet' },
  { id: 'card',    label: 'Credit / Debit Card',  icon: '💳', desc: 'Visa, Mastercard, JCB' },
  { id: 'bank',    label: 'Bank Transfer',         icon: '🏦', desc: 'BDO, BPI, Metrobank, UnionBank' },
  { id: 'cod',     label: 'Cash on Delivery',      icon: '💵', desc: 'Pay when your order arrives' },
  { id: 'maya',    label: 'Maya (PayMaya)',         icon: '💚', desc: 'Pay via Maya e-wallet' },
];

export default function CheckoutPage() {
  const { user, cartItems, cartSubtotal, clearCart, showToast } = useApp();
  const navigate = useNavigate();

  const [delivery,  setDelivery]  = useState('delivery');
  const [payment,   setPayment]   = useState('');
  const [notes,     setNotes]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});

  const shippingFee = delivery === 'pickup' ? 0
    : cartSubtotal >= SHIPPING_FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const orderTotal  = cartSubtotal + shippingFee;

  const addr = user?.address ?? {};
  const fullAddress = [addr.street, addr.barangay, addr.city, addr.province, addr.region, addr.zip]
    .filter(Boolean).join(', ');

  const validate = () => {
    const errs = {};
    if (!payment) errs.payment = 'Please select a payment method.';
    return errs;
  };

  const handlePlaceOrder = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    clearCart();
    setSubmitted(true);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Success screen ──────────────────────────────────────
  if (submitted) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="order-success__icon" aria-hidden="true">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p>
              Thank you, <strong>{user.firstName}</strong>! Your order has been received and is being processed.
            </p>
            <div className="order-success__info">
              <div className="order-success__row">
                <span>Order Number</span>
                <strong>#CF-{Date.now().toString().slice(-7)}</strong>
              </div>
              <div className="order-success__row">
                <span>Payment Method</span>
                <strong>{PAYMENT_METHODS.find(p => p.id === payment)?.label}</strong>
              </div>
              <div className="order-success__row">
                <span>Delivery Method</span>
                <strong>{delivery === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</strong>
              </div>
              <div className="order-success__row">
                <span>Total Amount</span>
                <strong style={{ color: 'var(--clr-primary)' }}>{fmt(orderTotal)}</strong>
              </div>
            </div>
            <p className="order-success__eta">
              {delivery === 'pickup'
                ? '📦 Your order will be ready for pickup in 1–2 business days.'
                : '🚚 Estimated delivery: 3–7 business days within the Philippines.'}
            </p>
            <div className="order-success__btns">
              <Link to="/history" className="btn btn-primary btn-lg">View Order History</Link>
              <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Checkout</h1>
          <p className="page-hero__subtitle">Complete your order</p>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <Link to="/cart">Cart</Link>
            <span className="sep">›</span>
            <span className="current" aria-current="page">Checkout</span>
          </nav>
        </div>
      </section>

      <div className="checkout-main">
        <div className="container">
          <div className="checkout-layout">

            {/* ── Left: Checkout form ── */}
            <div className="checkout-form-col">

              {/* Delivery Info */}
              <section className="checkout-section" aria-labelledby="del-heading">
                <h2 id="del-heading" className="checkout-section__title">
                  <span aria-hidden="true">📍</span> Delivery Information
                </h2>
                <div className="checkout-address-card">
                  <div className="checkout-address-card__info">
                    <strong>{[user.firstName, user.middleName, user.lastName, user.extension].filter(Boolean).join(' ')}</strong>
                    <span>{user.mobile}</span>
                    <span>{fullAddress || 'No address on file'}</span>
                  </div>
                  <Link to="/profile" className="btn btn-outline btn-sm">Edit</Link>
                </div>
              </section>

              {/* Delivery Method */}
              <section className="checkout-section" aria-labelledby="method-heading">
                <h2 id="method-heading" className="checkout-section__title">
                  <span aria-hidden="true">🚚</span> Delivery Method
                </h2>
                <div className="delivery-options" role="radiogroup" aria-label="Delivery method">
                  <label className={`delivery-option${delivery === 'delivery' ? ' selected' : ''}`}>
                    <input
                      type="radio" name="delivery" value="delivery"
                      checked={delivery === 'delivery'}
                      onChange={() => setDelivery('delivery')}
                      className="sr-only"
                    />
                    <div className="delivery-option__icon" aria-hidden="true">🚚</div>
                    <div className="delivery-option__info">
                      <strong>Home Delivery</strong>
                      <span>3–7 business days nationwide</span>
                      <span className="delivery-option__price">
                        {cartSubtotal >= SHIPPING_FREE_THRESHOLD ? (
                          <span style={{ color: 'var(--clr-success)' }}>FREE</span>
                        ) : (
                          fmt(DELIVERY_FEE)
                        )}
                      </span>
                    </div>
                    <div className="delivery-option__check" aria-hidden="true" />
                  </label>

                  <label className={`delivery-option${delivery === 'pickup' ? ' selected' : ''}`}>
                    <input
                      type="radio" name="delivery" value="pickup"
                      checked={delivery === 'pickup'}
                      onChange={() => setDelivery('pickup')}
                      className="sr-only"
                    />
                    <div className="delivery-option__icon" aria-hidden="true">🏪</div>
                    <div className="delivery-option__info">
                      <strong>Store Pickup</strong>
                      <span>{PICKUP_ADDRESS}</span>
                      <span className="delivery-option__price" style={{ color: 'var(--clr-success)' }}>FREE</span>
                    </div>
                    <div className="delivery-option__check" aria-hidden="true" />
                  </label>
                </div>
              </section>

              {/* Payment Method */}
              <section className="checkout-section" aria-labelledby="pay-heading">
                <h2 id="pay-heading" className="checkout-section__title">
                  <span aria-hidden="true">💳</span> Payment Method
                </h2>
                {errors.payment && (
                  <div className="alert alert-error" role="alert">
                    <span>⚠</span> {errors.payment}
                  </div>
                )}
                <div className="payment-options" role="radiogroup" aria-label="Payment methods">
                  {PAYMENT_METHODS.map(pm => (
                    <label
                      key={pm.id}
                      className={`payment-option${payment === pm.id ? ' selected' : ''}`}
                    >
                      <input
                        type="radio" name="payment" value={pm.id}
                        checked={payment === pm.id}
                        onChange={() => { setPayment(pm.id); setErrors({}); }}
                        className="sr-only"
                      />
                      <span className="payment-option__icon" aria-hidden="true">{pm.icon}</span>
                      <div className="payment-option__info">
                        <strong>{pm.label}</strong>
                        <span>{pm.desc}</span>
                      </div>
                      <div className="payment-option__check" aria-hidden="true" />
                    </label>
                  ))}
                </div>
              </section>

              {/* Order Notes */}
              <section className="checkout-section" aria-labelledby="notes-heading">
                <h2 id="notes-heading" className="checkout-section__title">
                  <span aria-hidden="true">📝</span> Order Notes <small>(Optional)</small>
                </h2>
                <div className="form-group">
                  <label htmlFor="order-notes" className="sr-only">Order notes</label>
                  <textarea
                    id="order-notes"
                    className="form-control"
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any special instructions for your order or delivery…"
                  />
                </div>
              </section>
            </div>

            {/* ── Right: Order Summary ── */}
            <aside className="checkout-summary" aria-label="Order summary">
              <div className="checkout-summary__inner">
                <h2 className="checkout-summary__title">Order Summary</h2>

                <ul className="checkout-items-list">
                  {cartItems.map(item => (
                    <li key={item.id} className="checkout-item">
                      <div className="checkout-item__img">
                        <img src={item.image} alt={item.name} loading="lazy" />
                        <span className="checkout-item__qty">{item.qty}</span>
                      </div>
                      <span className="checkout-item__name">{item.name}</span>
                      <span className="checkout-item__price">{fmt(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>

                <dl className="summary-list">
                  <div className="summary-row">
                    <dt>Subtotal</dt>
                    <dd>{fmt(cartSubtotal)}</dd>
                  </div>
                  <div className="summary-row">
                    <dt>Shipping</dt>
                    <dd className={shippingFee === 0 ? 'text-success' : ''}>
                      {shippingFee === 0 ? 'FREE' : fmt(shippingFee)}
                    </dd>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row summary-row--total">
                    <dt>Total</dt>
                    <dd>{fmt(orderTotal)}</dd>
                  </div>
                </dl>

                <button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading
                    ? <><span className="spinner" /> Processing Order…</>
                    : `Place Order · ${fmt(orderTotal)}`
                  }
                </button>

                <p className="checkout-summary__security">
                  🔒 Your payment information is secure and encrypted.
                </p>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
}
