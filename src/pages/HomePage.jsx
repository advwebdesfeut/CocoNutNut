import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard  from '../components/ProductCard';
import './HomePage.css';

export default function HomePage() {
  const featured = products.filter(p => p.badge === 'bestseller').slice(0, 4);

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero" aria-label="Hero banner">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__bg-overlay" />
        </div>
        <div className="container hero__content">
          <p className="hero__eyebrow animate-fade-in-up">🌿 Made in the Philippines</p>
          <h1 className="hero__title animate-fade-in-up animate-delay-1">
            Nature's Fiber,<br />
            <em>Reimagined</em>
          </h1>
          <p className="hero__subtitle animate-fade-in-up animate-delay-2">
            Discover premium eco-friendly products crafted from coconut coir —
            sustainable, durable, and beautifully natural.
          </p>
          <div className="hero__ctas animate-fade-in-up animate-delay-3">
            <Link to="/storefront" className="btn btn-accent btn-lg">
              Shop Featured Products
            </Link>
            <Link to="/products" className="btn btn-outline-light btn-lg">
              View All Products
            </Link>
          </div>
          <div className="hero__badges animate-fade-in-up animate-delay-4">
            <span className="hero__badge">🌱 100% Natural</span>
            <span className="hero__badge">♻️ Biodegradable</span>
            <span className="hero__badge">🇵🇭 Proudly Filipino</span>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-bar" aria-label="Key statistics">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: '1,200+', label: 'Happy Customers' },
              { value: '14',     label: 'Product Types'   },
              { value: '4',      label: 'Product Categories' },
              { value: '100%',   label: 'Eco-Friendly'    },
            ].map(s => (
              <div key={s.label} className="stat-item">
                <strong className="stat-value">{s.value}</strong>
                <span  className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Coconut Coir ── */}
      <section className="about-section" aria-labelledby="about-heading">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual" aria-hidden="true">
              <div className="about-img-frame">
                <img
                  src="/images/coir.jpg"
                  alt="Coconut coir fiber — natural and sustainable"
                  loading="lazy"
                />
                <div className="about-img-badge">
                  <span className="about-img-badge__icon">🥥</span>
                  <span>From coconut husk to finished product</span>
                </div>
              </div>
            </div>
            <div className="about-text">
              <p className="section-label">Our Story &amp; Background</p>
              <h2 className="section-title" id="about-heading">
                What Is Coconut Coir?
              </h2>
              <div className="divider" style={{ margin: '0 0 var(--sp-6)' }}/>
              <p>
                <strong>Coconut coir</strong>, also known as <em>coconut fiber</em>,
                is a natural fiber derived from the outer husk of coconuts. It is the
                fibrous material found between the hard internal shell and the outer
                coat of the coconut.
              </p>
              <p>
                In the Philippines, one of the world's top coconut-producing nations,
                this versatile material has been used for centuries — from making rope
                and doormats to modern agricultural growing media and construction
                geo-textiles.
              </p>
              <p>
                Utilizing coconut coir to create <strong>eco-friendly products</strong>
                that serve diverse fields — including construction, gardening, home
                décor, and crafts — is still an emerging industry in the Philippines.
                At <strong>CocoNutNut PH</strong>, we believe this "soon-to-be successful
                industry" starts with connecting Filipino farmers with conscious consumers.
              </p>
              <div className="about-features">
                {[
                  { icon: '💪', title: 'Durable & Strong',     desc: 'Naturally resistant to salt water and harsh weather.' },
                  { icon: '🌿', title: 'Fully Biodegradable',  desc: 'Returns to the earth without harmful residue.' },
                  { icon: '🌾', title: 'Agricultural Waste',   desc: 'Transforms what was once discarded into value.' },
                  { icon: '💧', title: 'Moisture Retention',   desc: 'Holds water while providing excellent drainage.' },
                ].map(f => (
                  <div key={f.title} className="about-feature">
                    <span className="about-feature__icon" aria-hidden="true">{f.icon}</span>
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/storefront" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--sp-6)' }}>
                Explore Our Products →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="categories-section" aria-labelledby="categories-heading">
        <div className="container">
          <header className="section-header">
            <p className="section-label">Browse By</p>
            <h2 className="section-title" id="categories-heading">Product Categories</h2>
            <div className="divider" />
          </header>
          <div className="categories-grid">
            {[
              {
                id: 'home', icon: '🏠', title: 'Home & Living',
                desc: 'Doormats, planters, mattresses, and wall panels.',
                color: '#8B5E3C',
              },
              {
                id: 'garden', icon: '🌿', title: 'Garden & Agriculture',
                desc: 'Pots, mulch mats, grow bags, coco peat, and more.',
                color: '#4E7A28',
              },
              {
                id: 'construction', icon: '🏗️', title: 'Construction',
                desc: 'Erosion blankets, geo-textiles, and reinforcement.',
                color: '#6B5744',
              },
              {
                id: 'crafts', icon: '🎨', title: 'Crafts & DIY',
                desc: 'Wall panels, craft kits, rope, and twine.',
                color: '#BF8020',
              },
            ].map(cat => (
              <Link
                key={cat.id}
                to={`/products?cat=${cat.id}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-card__icon" aria-hidden="true">{cat.icon}</div>
                <h3 className="category-card__title">{cat.title}</h3>
                <p className="category-card__desc">{cat.desc}</p>
                <span className="category-card__cta">Shop Now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers Preview ── */}
      <section className="bestsellers-section" aria-labelledby="bestsellers-heading">
        <div className="container">
          <header className="section-header">
            <p className="section-label">🔥 Top Picks</p>
            <h2 className="section-title" id="bestsellers-heading">Best Sellers</h2>
            <div className="divider" />
            <p className="section-subtitle">
              Our most-loved products, trusted by hundreds of Filipino households.
            </p>
          </header>
          <div className="grid-auto-fill-md">
            {featured.map((p, i) => (
              <div key={p.id} className={`animate-fade-in-up animate-delay-${i + 1}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--sp-10)' }}>
            <Link to="/storefront" className="btn btn-primary btn-lg">
              See All Featured Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="whyus-section" aria-labelledby="whyus-heading">
        <div className="container">
          <header className="section-header">
            <p className="section-label">Why Choose Us</p>
            <h2 className="section-title" id="whyus-heading">The CocoNutNut Difference</h2>
            <div className="divider" />
          </header>
          <div className="whyus-grid">
            {[
              { icon: '🌱', title: 'Sustainably Sourced',  desc: 'All fibers come directly from partner coconut farms in Quezon, Laguna, and Davao.' },
              { icon: '🤝', title: 'Farmer-Fair Pricing',  desc: 'We pay premium rates to local farmers, ensuring fair trade from husk to product.' },
              { icon: '📦', title: 'Nationwide Delivery',  desc: 'Fast and affordable shipping to all major islands via trusted logistics partners.' },
              { icon: '⭐', title: 'Quality Guaranteed',   desc: "30-day satisfaction guarantee — if it's not perfect, we'll make it right." },
              { icon: '🎨', title: 'Custom Orders',        desc: "Need a bulk order or custom size? Reach out — we love special projects!" },
              { icon: '🌊', title: 'Carbon Neutral Goal',  desc: 'Working toward carbon neutrality by 2027 through reforestation partnerships.' },
            ].map(w => (
              <div key={w.title} className="whyus-card">
                <span className="whyus-card__icon" aria-hidden="true">{w.icon}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section" aria-label="Call to action">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <h2>Ready to Go Green?</h2>
              <p>Join thousands of eco-conscious Filipinos choosing natural coir products.</p>
            </div>
            <div className="cta-btns">
              <Link to="/register" className="btn btn-accent btn-lg">Create an Account</Link>
              <Link to="/products" className="btn btn-outline-light btn-lg">Browse Products</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}