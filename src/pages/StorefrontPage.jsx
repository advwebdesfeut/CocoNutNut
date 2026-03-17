import { useState, useEffect } from 'react';
import { Link }         from 'react-router-dom';
import { products }     from '../data/products';
import ProductCard      from '../components/ProductCard';
import './StorefrontPage.css';

// Hero slides for the storefront banner
const SLIDES = [
  {
    id: 1,
    tag:   '🔥 Best Sellers',
    title: 'Our Most-Loved Products',
    sub:   'Trusted by 1,200+ Filipino households. Shop what works.',
    bg:    '#3D200E',
    accent:'#BF8020',
    cta:   'Shop Best Sellers',
    filter:'bestseller',
  },
  {
    id: 2,
    tag:   '✨ Just Arrived',
    title: 'New Arrivals This Season',
    sub:   'Fresh coir products for your home, garden, and projects.',
    bg:    '#1E3D12',
    accent:'#82BE4A',
    cta:   'Discover New Products',
    filter:'new',
  },
  {
    id: 3,
    tag:   '📈 Trending Now',
    title: 'What Everyone Is Buying',
    sub:   'Join the eco movement — these picks are flying off the shelves.',
    bg:    '#2C1E00',
    accent:'#DFA030',
    cta:   'See Trending Items',
    filter:'trending',
  },
];

export default function StorefrontPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = SLIDES[activeSlide];

  // Auto-advance banner
  useEffect(() => {
    const t = setInterval(() => setActiveSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const getByBadge = (badge) => products.filter(p => p.badge === badge);

  const sections = [
    { id: 'bestseller', label: 'Best Sellers',  icon: '🏆', desc: 'Our top-rated, most-purchased products.' },
    { id: 'new',        label: 'New Arrivals',   icon: '✨', desc: 'Just added — fresh from our workshop.' },
    { id: 'trending',   label: 'Trending Now',   icon: '📈', desc: 'Popular picks climbing the charts.' },
  ];

  return (
    <div className="storefront-page">

      {/* ── Hero Banner Carousel ── */}
      <section
        className="sf-hero"
        style={{ '--slide-bg': slide.bg, '--slide-accent': slide.accent }}
        aria-label="Featured product banner"
      >
        <div className="sf-hero__bg" aria-hidden="true" />
        <div className="container sf-hero__content">
          <p  className="sf-hero__tag">{slide.tag}</p>
          <h1 className="sf-hero__title" key={slide.id}>{slide.title}</h1>
          <p  className="sf-hero__sub">{slide.sub}</p>
          <a  href={`#section-${slide.filter}`} className="btn btn-accent btn-lg">
            {slide.cta}
          </a>
        </div>

        {/* Slide indicators */}
        <div className="sf-hero__dots" role="tablist" aria-label="Banner slides">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`sf-hero__dot${i === activeSlide ? ' active' : ''}`}
              onClick={() => setActiveSlide(i)}
              role="tab"
              aria-selected={i === activeSlide}
              aria-label={`Slide ${i + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Nav arrows */}
        <button
          className="sf-hero__arrow sf-hero__arrow--prev"
          onClick={() => setActiveSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Previous slide"
        >‹</button>
        <button
          className="sf-hero__arrow sf-hero__arrow--next"
          onClick={() => setActiveSlide(s => (s + 1) % SLIDES.length)}
          aria-label="Next slide"
        >›</button>
      </section>

      {/* ── Featured Sections ── */}
      {sections.map((sec, si) => {
        const items = getByBadge(sec.id);
        return (
          <section
            key={sec.id}
            id={`section-${sec.id}`}
            className={`sf-section${si % 2 === 1 ? ' sf-section--alt' : ''}`}
            aria-labelledby={`sf-heading-${sec.id}`}
          >
            <div className="container">
              <header className="sf-section__header">
                <div className="sf-section__title-wrap">
                  <span className="sf-section__icon" aria-hidden="true">{sec.icon}</span>
                  <div>
                    <p className="section-label">{sec.label}</p>
                    <h2 className="section-title" id={`sf-heading-${sec.id}`}>
                      {sec.label}
                    </h2>
                    <p className="sf-section__desc">{sec.desc}</p>
                  </div>
                </div>
                <Link to="/products" className="btn btn-outline sf-section__see-all">
                  See All →
                </Link>
              </header>

              <div className="grid-auto-fill-md">
                {items.map((p, i) => (
                  <div key={p.id} className={`animate-fade-in-up animate-delay-${Math.min(i+1,5)}`}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Promo Banner ── */}
      <section className="sf-promo" aria-label="Promotional offer">
        <div className="container">
          <div className="sf-promo__inner">
            <div className="sf-promo__text">
              <span className="section-label">Limited Time Offer</span>
              <h2>Free Shipping on Orders ₱1,500+</h2>
              <p>Valid for all orders delivered within Metro Manila &amp; select provinces.</p>
            </div>
            <div className="sf-promo__cta">
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/register" className="btn btn-outline">Sign Up &amp; Save</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="sf-testimonials" aria-labelledby="testi-heading">
        <div className="container">
          <header className="section-header">
            <p className="section-label">What Customers Say</p>
            <h2 className="section-title" id="testi-heading">Customer Reviews</h2>
            <div className="divider" />
          </header>
          <div className="testi-grid">
            {[
              {
                name: 'Ana G.', location: 'Quezon City', rating: 5,
                text: 'The coco peat I ordered is amazing! My vegetable garden has never looked better. Will definitely reorder.',
                product: 'Coco Peat Block 5 kg',
              },
              {
                name: 'Ramon T.', location: 'Cebu City', rating: 5,
                text: 'Solid quality doormat. It\'s thick, durable, and looks great at our entrance. Perfect for the rainy season.',
                product: 'Premium Coir Doormat',
              },
              {
                name: 'Liza M.', location: 'Davao City', rating: 4,
                text: 'Love the hanging planter! My ferns are thriving. Fast delivery too — came in 3 days from Manila.',
                product: 'Hanging Coir Planter',
              },
              {
                name: 'Ben A.', location: 'Makati', rating: 5,
                text: 'Bought the DIY craft kit for my daughter. She loved making a wall hanging! Great value for the price.',
                product: 'Coir Craft Kit',
              },
            ].map(t => (
              <article key={t.name} className="testi-card">
                <div className="testi-card__rating" aria-label={`${t.rating} out of 5`}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5-t.rating)}
                </div>
                <p className="testi-card__text">"{t.text}"</p>
                <footer className="testi-card__footer">
                  <div className="testi-card__avatar" aria-hidden="true">
                    {t.name[0]}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.location} · {t.product}</span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
