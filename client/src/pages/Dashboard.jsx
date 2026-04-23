import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { User, Plane, Hotel, Calendar, X, RefreshCw } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.type === filter || b.status === filter);

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <div className="user-info">
            <div className="user-avatar"><User size={28} /></div>
            <div>
              <h1 className="dashboard-title">My Dashboard</h1>
              <p className="user-email">{user?.name} · {user?.email}</p>
            </div>
          </div>
          <div className="dashboard-stats">
            <div className="stat-card card">
              <div className="stat-num">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card card">
              <div className="stat-num">{bookings.filter(b => b.status === 'confirmed').length}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card card">
              <div className="stat-num">₹{bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0).toLocaleString('en-IN')}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        </div>

        <div className="bookings-section">
          <div className="bookings-header">
            <h2 className="section-title">My Bookings</h2>
            <div className="filter-tabs">
              {['all', 'flight', 'hotel', 'confirmed', 'cancelled'].map(f => (
                <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Loader text="Loading bookings..." />
          ) : filtered.length === 0 ? (
            <div className="empty-bookings card">
              <Calendar size={48} style={{ color: 'var(--border)', marginBottom: 12 }} />
              <h3>No bookings found</h3>
              <p>Start exploring flights and hotels</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/flights')}>Search Flights</button>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/hotels')}>Search Hotels</button>
              </div>
            </div>
          ) : (
            <div className="bookings-list">
              {filtered.map(b => (
                <BookingCard key={b._id} booking={b} onCancel={cancelBooking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel }) {
  const isFlight = booking.type === 'flight';
  const item = isFlight ? booking.flight : booking.hotel;
  const isConfirmed = booking.status === 'confirmed';

  return (
    <div className={`booking-card card fade-in ${!isConfirmed ? 'cancelled' : ''}`}>
      <div className="booking-card-header">
        <div className="booking-type-badge">
          {isFlight ? <Plane size={14} /> : <Hotel size={14} />}
          <span>{isFlight ? 'Flight' : 'Hotel'}</span>
        </div>
        <span className={`badge ${isConfirmed ? 'badge-green' : 'badge-red'}`}>
          {booking.status}
        </span>
      </div>

      <div className="booking-card-body">
        {isFlight && item ? (
          <div className="booking-details">
            <div className="booking-main-info">
              <div className="booking-route">{item.from} → {item.to}</div>
              <div className="booking-sub">{item.airline} · {item.flightNumber} · {item.class}</div>
              <div className="booking-sub">{item.date} · {item.departureTime} – {item.arrivalTime}</div>
            </div>
            <div className="booking-passengers">
              {booking.passengers?.map((p, i) => (
                <span key={i} className="badge badge-gray">{p.name}</span>
              ))}
            </div>
          </div>
        ) : item ? (
          <div className="booking-details">
            <div className="booking-main-info">
              <div className="booking-route">{item.name}</div>
              <div className="booking-sub">{item.city} · {'★'.repeat(item.rating)}</div>
              <div className="booking-sub">{booking.checkIn} → {booking.checkOut} · {booking.rooms} room{booking.rooms > 1 ? 's' : ''}</div>
            </div>
          </div>
        ) : (
          <div className="booking-details"><div className="booking-route">Booking details unavailable</div></div>
        )}

        <div className="booking-card-footer">
          <div>
            <div className="booking-ref">Ref: {booking.bookingRef}</div>
            <div className="booking-price">₹{booking.totalPrice.toLocaleString('en-IN')}</div>
          </div>
          {isConfirmed && (
            <button className="btn btn-danger btn-sm" onClick={() => onCancel(booking._id)}>
              <X size={13} /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
