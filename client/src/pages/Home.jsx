import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, MapPin, Calendar, Users, Search, ArrowRight } from 'lucide-react';
import './Home.css';

const POPULAR_ROUTES = [
  { from: 'Delhi', to: 'Mumbai', price: '₹3,199' },
  { from: 'Mumbai', to: 'Bangalore', price: '₹2,799' },
  { from: 'Delhi', to: 'Kolkata', price: '₹4,299' },
  { from: 'Bangalore', to: 'Chennai', price: '₹1,999' },
];

const POPULAR_HOTELS = [
  { city: 'Mumbai', desc: 'Gateway of India' },
  { city: 'Delhi', desc: 'Capital City' },
  { city: 'Bangalore', desc: 'Silicon Valley of India' },
  { city: 'Hyderabad', desc: 'City of Pearls' },
];

export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('flights');
  const today = new Date().toISOString().split('T')[0];

  const [flightForm, setFlightForm] = useState({ from: '', to: '', date: today });
  const [hotelForm, setHotelForm] = useState({ city: '', checkIn: today });

  const searchFlights = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(flightForm);
    navigate(`/flights?${p}`);
  };

  const searchHotels = (e) => {
    e.preventDefault();
    navigate(`/hotels?city=${hotelForm.city}`);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1 className="hero-title fade-in">Explore the World with <span>TravelEase</span></h1>
          <p className="hero-sub fade-in">Book flights & hotels at the best prices. Fast, easy, reliable.</p>

          <div className="search-box card fade-in">
            <div className="search-tabs">
              <button className={`search-tab ${tab === 'flights' ? 'active' : ''}`} onClick={() => setTab('flights')}>
                <Plane size={16} /> Flights
              </button>
              <button className={`search-tab ${tab === 'hotels' ? 'active' : ''}`} onClick={() => setTab('hotels')}>
                <Hotel size={16} /> Hotels
              </button>
            </div>

            {tab === 'flights' ? (
              <form className="search-form" onSubmit={searchFlights}>
                <div className="search-field">
                  <label><MapPin size={14} /> From</label>
                  <input className="form-input" placeholder="e.g. Delhi" value={flightForm.from}
                    onChange={e => setFlightForm({ ...flightForm, from: e.target.value })} required />
                </div>
                <div className="search-field">
                  <label><MapPin size={14} /> To</label>
                  <input className="form-input" placeholder="e.g. Mumbai" value={flightForm.to}
                    onChange={e => setFlightForm({ ...flightForm, to: e.target.value })} required />
                </div>
                <div className="search-field">
                  <label><Calendar size={14} /> Date</label>
                  <input type="date" className="form-input" value={flightForm.date} min={today}
                    onChange={e => setFlightForm({ ...flightForm, date: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-secondary btn-lg search-btn">
                  <Search size={18} /> Search Flights
                </button>
              </form>
            ) : (
              <form className="search-form" onSubmit={searchHotels}>
                <div className="search-field wide">
                  <label><MapPin size={14} /> City</label>
                  <input className="form-input" placeholder="e.g. Mumbai, Delhi, Bangalore" value={hotelForm.city}
                    onChange={e => setHotelForm({ ...hotelForm, city: e.target.value })} required />
                </div>
                <div className="search-field">
                  <label><Calendar size={14} /> Check-in</label>
                  <input type="date" className="form-input" value={hotelForm.checkIn} min={today}
                    onChange={e => setHotelForm({ ...hotelForm, checkIn: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-secondary btn-lg search-btn">
                  <Search size={18} /> Search Hotels
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Popular Flight Routes</h2>
        <div className="routes-grid">
          {POPULAR_ROUTES.map((r, i) => (
            <div key={i} className="route-card card" onClick={() => navigate(`/flights?from=${r.from}&to=${r.to}&date=${today}`)}>
              <div className="route-cities">
                <span>{r.from}</span>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{r.to}</span>
              </div>
              <div className="route-price">From {r.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Top Hotel Destinations</h2>
        <div className="destinations-grid">
          {POPULAR_HOTELS.map((h, i) => (
            <div key={i} className="destination-card card" onClick={() => navigate(`/hotels?city=${h.city}`)}>
              <div className="dest-icon"><Hotel size={24} /></div>
              <div className="dest-city">{h.city}</div>
              <div className="dest-desc">{h.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
