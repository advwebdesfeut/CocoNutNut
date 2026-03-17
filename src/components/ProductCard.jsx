import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Format Philippine Peso
const fmt = (n) =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0 });

// Star rating display
const Stars = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      {half ? '⯨' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
};

export default function ProductCard({ product }) {
  const { addToCart, user } = useApp();
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    addToCart(product);
  };

  const badgeLabels = {
    new:        'New',
    trending:   'Trending',
    bestseller: 'Best Seller',
    sale:       'Sale',
  };

  return (
    <article className="product-card" aria-label={product.name}>
      {/* Image */}
      <div className="product-card__img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="400"
          height="300"
        />
        {product.badge && (
          <span className={`product-card__badge product-card__badge--${product.badge}`}>
            {badgeLabels[product.badge]}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        {/* Rating */}
        <div className="product-card__rating">
          <Stars rating={product.rating} />
          <span className="text-muted">({product.reviews})</span>
        </div>

        {/* Price row */}
        <div className="product-card__price-row">
          <div>
            <span className="product-card__price">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="product-card__orig-price" style={{ marginLeft: '0.5rem' }}>
                {fmt(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            className="add-to-cart-btn"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? '✕' : '+'}
          </button>
        </div>
      </div>
    </article>
  );
}
