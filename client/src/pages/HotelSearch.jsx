import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import HotelCard from '../components/HotelCard';
import Loader from '../components/Loader';
import { SlidersHorizontal, Hotel } from 'lucide-react';
import './SearchPage.css';

export default function HotelSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [minRating, setMinRating] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('price');

  const search = async (c = city) => {
    setLoading(true);
    setSearched(true);
    try {
      const q = new URLSearchParams();
      if (c) q.set('city', c);
      if (maxPrice) q.set('maxPrice', maxPrice);
      if (minRating) q.set('rating', minRating);
      const { data } = await api.get(`/hotels/search?${q}`);
      setHotels(data.hotels);
    } catch {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('city')) search(searchParams.get('city'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ city });
    search(city);
  };

  const filtered = hotels
    .filter(h => !maxPrice || h.pricePerNight <= Number(maxPrice))
    .filter(h => !minRating || h.rating >= Number(minRating))
    .sort((a, b) => sortBy === 'price' ? a.pricePerNight - b.pricePerNight : b.rating - a.rating);

  return (
    <div className="page">
      <div className="container">
        <div className="search-header">
          <h1 className="page-title"><Hotel size={24} /> Search Hotels</h1>
        </div>

        <form className="search-bar card" onSubmit={handleSubmit}>
          <div className="search-bar-fields">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">City</label>
              <input className="form-input" placeholder="Mumbai, Delhi, Bangalore..." value={city}
                onChange={e => setCity(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Search Hotels</button>
          </div>
        </form>

        {searched && (
          <div className="results-layout">
            <aside className="filters-panel card">
              <h3 className="filters-title"><SlidersHorizontal size={16} /> Filters</h3>
              <div className="divider" />
              <div className="form-group">
                <label className="form-label">Max Price/Night (₹)</label>
                <input type="number" className="form-input" placeholder="e.g. 10000" value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Min Rating</label>
                <select className="form-input" value={minRating} onChange={e => setMinRating(e.target.value)}>
                  <option value="">Any</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Sort By</label>
                <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>
              {(maxPrice || minRating) && (
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: '100%' }}
                  onClick={() => { setMaxPrice(''); setMinRating(''); }}>
                  Clear Filters
                </button>
              )}
            </aside>

            <div className="results-list">
              {loading ? (
                <Loader text="Searching hotels..." />
              ) : filtered.length === 0 ? (
                <div className="empty-state card">
                  <Hotel size={48} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <h3>No hotels found</h3>
                  <p>Try a different city or adjust filters</p>
                </div>
              ) : (
                <>
                  <div className="results-count">{filtered.length} hotel{filtered.length !== 1 ? 's' : ''} found</div>
                  <div className="hotels-grid">
                    {filtered.map(h => <HotelCard key={h._id} hotel={h} />)}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!searched && (
          <div className="empty-state card" style={{ marginTop: 32 }}>
            <Hotel size={48} style={{ color: 'var(--border)', marginBottom: 12 }} />
            <h3>Search for hotels</h3>
            <p>Enter a city name to find available hotels</p>
          </div>
        )}
      </div>
    </div>
  );
}
