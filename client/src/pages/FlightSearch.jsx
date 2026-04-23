import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import FlightCard from '../components/FlightCard';
import Loader from '../components/Loader';
import { SlidersHorizontal, Plane } from 'lucide-react';
import './SearchPage.css';

export default function FlightSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || today,
    class: '',
  });
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('price');

  const search = async (params = form) => {
    setLoading(true);
    setSearched(true);
    try {
      const q = new URLSearchParams();
      if (params.from) q.set('from', params.from);
      if (params.to) q.set('to', params.to);
      if (params.date) q.set('date', params.date);
      if (params.class) q.set('class', params.class);
      const { data } = await api.get(`/flights/search?${q}`);
      setFlights(data.flights);
    } catch {
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('from') || searchParams.get('to') || searchParams.get('date')) {
      search();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(form);
    search(form);
  };

  const filtered = flights
    .filter(f => !maxPrice || f.price <= Number(maxPrice))
    .sort((a, b) => sortBy === 'price' ? a.price - b.price : a.departureTime.localeCompare(b.departureTime));

  return (
    <div className="page">
      <div className="container">
        <div className="search-header">
          <h1 className="page-title"><Plane size={24} /> Search Flights</h1>
        </div>

        <form className="search-bar card" onSubmit={handleSubmit}>
          <div className="search-bar-fields">
            <div className="form-group">
              <label className="form-label">From</label>
              <input className="form-input" placeholder="Delhi" value={form.from}
                onChange={e => setForm({ ...form, from: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">To</label>
              <input className="form-input" placeholder="Mumbai" value={form.to}
                onChange={e => setForm({ ...form, to: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={form.date} min={today}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Class</label>
              <select className="form-input" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                <option value="">All Classes</option>
                <option>Economy</option>
                <option>Business</option>
                <option>First</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </form>

        {searched && (
          <div className="results-layout">
            <aside className="filters-panel card">
              <h3 className="filters-title"><SlidersHorizontal size={16} /> Filters</h3>
              <div className="divider" />
              <div className="form-group">
                <label className="form-label">Max Price (₹)</label>
                <input type="number" className="form-input" placeholder="e.g. 5000" value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Sort By</label>
                <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="price">Price: Low to High</option>
                  <option value="time">Departure Time</option>
                </select>
              </div>
              {maxPrice && (
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: '100%' }} onClick={() => setMaxPrice('')}>
                  Clear Filters
                </button>
              )}
            </aside>

            <div className="results-list">
              {loading ? (
                <Loader text="Searching flights..." />
              ) : filtered.length === 0 ? (
                <div className="empty-state card">
                  <Plane size={48} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <h3>No flights found</h3>
                  <p>Try different dates or routes</p>
                </div>
              ) : (
                <>
                  <div className="results-count">{filtered.length} flight{filtered.length !== 1 ? 's' : ''} found</div>
                  {filtered.map(f => <FlightCard key={f._id} flight={f} />)}
                </>
              )}
            </div>
          </div>
        )}

        {!searched && (
          <div className="empty-state card" style={{ marginTop: 32 }}>
            <Plane size={48} style={{ color: 'var(--border)', marginBottom: 12 }} />
            <h3>Search for flights</h3>
            <p>Enter your origin, destination and date above</p>
          </div>
        )}
      </div>
    </div>
  );
}
