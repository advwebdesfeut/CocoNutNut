import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockTransactions } from '../data/products';
import './TransactionHistoryPage.css';

const fmt = (n) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });

const STATUS_STYLE = {
  'Delivered':  { badge: 'badge-success', icon: '✅' },
  'Completed':  { badge: 'badge-info',    icon: '📋' },
  'Processing': { badge: 'badge-warning', icon: '⏳' },
  'Cancelled':  { badge: 'badge-danger',  icon: '❌' },
};

export default function TransactionHistoryPage() {
  const { user } = useApp();
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState('all');

  const filtered = filter === 'all'
    ? mockTransactions
    : mockTransactions.filter(t => t.status.toLowerCase() === filter);

  const totalSpent = mockTransactions.reduce((s, t) => s + t.total, 0);

  return (
    <div className="history-page">

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Order History</h1>
          <p className="page-hero__subtitle">
            Track and review all your past transactions.
          </p>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="sep">›</span>
            <a href="/profile">My Account</a>
            <span className="sep">›</span>
            <span className="current" aria-current="page">Order History</span>
          </nav>
        </div>
      </section>

      <div className="history-main">
        <div className="container">

          {/* ── Stats ── */}
          <div className="history-stats">
            {[
              { label: 'Total Orders',     value: mockTransactions.length },
              { label: 'Total Spent',      value: fmt(totalSpent)         },
              { label: 'Delivered Orders', value: mockTransactions.filter(t => t.status === 'Delivered').length },
              { label: 'Completed Orders', value: mockTransactions.filter(t => t.status === 'Completed').length },
            ].map(s => (
              <div key={s.label} className="history-stat">
                <strong className="history-stat__val">{s.value}</strong>
                <span   className="history-stat__label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── Filter Tabs ── */}
          <div className="history-filters" role="tablist" aria-label="Filter orders">
            {[
              { value: 'all',       label: 'All Orders' },
              { value: 'delivered', label: 'Delivered'  },
              { value: 'completed', label: 'Completed'  },
            ].map(f => (
              <button
                key={f.value}
                role="tab"
                aria-selected={filter === f.value}
                className={`history-filter-tab${filter === f.value ? ' active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                {f.value === 'all' && (
                  <span className="history-filter-count">{mockTransactions.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Orders ── */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📦</div>
              <h2 className="empty-state__title">No Orders Found</h2>
              <p className="empty-state__text">No orders match the current filter.</p>
              <button onClick={() => setFilter('all')} className="btn btn-primary">View All Orders</button>
            </div>
          ) : (
            <div className="orders-list">
              {filtered.map(tx => {
                const st = STATUS_STYLE[tx.status] ?? STATUS_STYLE['Completed'];
                const isExpanded = expanded === tx.id;
                return (
                  <article key={tx.id} className={`order-card${isExpanded ? ' order-card--expanded' : ''}`}>

                    {/* Order header */}
                    <div
                      className="order-card__header"
                      onClick={() => setExpanded(isExpanded ? null : tx.id)}
                      role="button"
                      aria-expanded={isExpanded}
                      aria-controls={`order-details-${tx.id}`}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setExpanded(isExpanded ? null : tx.id)}
                    >
                      <div className="order-card__id">
                        <span className="order-card__icon" aria-hidden="true">{st.icon}</span>
                        <div>
                          <strong>{tx.id}</strong>
                          <small>{new Date(tx.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                        </div>
                      </div>

                      <div className="order-card__meta">
                        <span className={`badge ${st.badge}`}>{tx.status}</span>
                        <span className="order-card__delivery-badge">
                          {tx.deliveryMethod === 'pickup' ? '🏪 Pickup' : '🚚 Delivery'}
                        </span>
                        <strong className="order-card__total">{fmt(tx.total)}</strong>
                        <span className="order-card__chevron" aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Order body */}
                    <div
                      id={`order-details-${tx.id}`}
                      className="order-card__body"
                      hidden={!isExpanded}
                    >
                      <div className="order-card__body-inner">
                        {/* Items */}
                        <div>
                          <h4 className="order-card__body-title">Items Ordered</h4>
                          <ul className="order-items-list">
                            {tx.items.map((item, i) => (
                              <li key={i} className="order-item">
                                <span className="order-item__name">{item.name}</span>
                                <span className="order-item__qty">× {item.qty}</span>
                                <span className="order-item__price">{fmt(item.price)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Details */}
                        <div className="order-card__details">
                          <h4 className="order-card__body-title">Order Details</h4>
                          <dl className="order-detail-list">
                            <div><dt>Payment</dt><dd>{tx.paymentMethod}</dd></div>
                            <div><dt>Delivery</dt><dd>{tx.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</dd></div>
                            <div><dt>Status</dt><dd><span className={`badge ${st.badge}`}>{tx.status}</span></dd></div>
                            <div><dt>Total</dt><dd><strong>{fmt(tx.total)}</strong></dd></div>
                          </dl>
                        </div>
                      </div>

                      <div className="order-card__actions">
                        <Link to="/products" className="btn btn-primary btn-sm">Reorder Items</Link>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
