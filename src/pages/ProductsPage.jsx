import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default'           },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated'         },
  { value: 'newest',     label: 'Newest'            },
];

export default function ProductsPage() {
  const [params, setParams]   = useSearchParams();
  const [search,   setSearch] = useState('');
  const [category, setCategory] = useState(params.get('cat') ?? 'all');
  const [sort,     setSort]   = useState('default');
  const [badge,    setBadge]  = useState('all');

  // Sync category from URL on mount
  useEffect(() => {
    const cat = params.get('cat');
    if (cat) setCategory(cat);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category !== 'all') list = list.filter(p => p.category === category);

    // Badge filter
    if (badge !== 'all') list = list.filter(p => p.badge === badge);

    // Sort
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     list.sort((a, b) => (b.badge === 'new') - (a.badge === 'new')); break;
      default: break;
    }

    return list;
  }, [search, category, sort, badge]);

  const handleCatChange = (cat) => {
    setCategory(cat);
    setParams(cat !== 'all' ? { cat } : {});
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setSort('default');
    setBadge('all');
    setParams({});
  };

  const hasFilters = search || category !== 'all' || sort !== 'default' || badge !== 'all';

  return (
    <div className="products-page">

      {/* ── Page Hero ── */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">All Products</h1>
          <p className="page-hero__subtitle">
            Browse our complete collection of eco-friendly coconut coir products.
          </p>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep" aria-hidden="true">›</span>
            <span className="current" aria-current="page">Products</span>
          </nav>
        </div>
      </section>

      {/* ── Filters Bar ── */}
      <div className="products-filters-bar">
        <div className="container">
          <div className="filters-inner">

            {/* Search */}
            <div className="filter-search">
              <label htmlFor="prod-search" className="sr-only">Search products</label>
              <span className="filter-search__icon" aria-hidden="true">🔍</span>
              <input
                id="prod-search"
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                className="form-control filter-search__input"
              />
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label htmlFor="prod-sort" className="sr-only">Sort by</label>
              <select
                id="prod-sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="form-control filter-select"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Badge filter */}
            <div className="filter-group">
              <label htmlFor="prod-badge" className="sr-only">Filter by badge</label>
              <select
                id="prod-badge"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                className="form-control filter-select"
              >
                <option value="all">All Types</option>
                <option value="bestseller">Best Sellers</option>
                <option value="new">New Arrivals</option>
                <option value="trending">Trending</option>
              </select>
            </div>

            {/* Clear */}
            {hasFilters && (
              <button onClick={clearFilters} className="btn btn-outline btn-sm">
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="products-cats-bar">
        <div className="container">
          <ul className="cats-tabs" role="tablist" aria-label="Product categories">
            {categories.map(cat => (
              <li key={cat.id} role="presentation">
                <button
                  role="tab"
                  aria-selected={category === cat.id}
                  className={`cats-tab${category === cat.id ? ' active' : ''}`}
                  onClick={() => handleCatChange(cat.id)}
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="products-main">
        <div className="container">
          <div className="products-meta">
            <p className="products-count">
              Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products
              {category !== 'all' && (
                <span> in <em>{categories.find(c => c.id === category)?.label}</em></span>
              )}
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid-auto-fill-md">
              {filtered.map((p, i) => (
                <div key={p.id} className={`animate-fade-in-up animate-delay-${Math.min(i % 4 + 1, 5)}`}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <h2 className="empty-state__title">No Products Found</h2>
              <p className="empty-state__text">
                We couldn't find products matching your search. Try adjusting your filters.
              </p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
