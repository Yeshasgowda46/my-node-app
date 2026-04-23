import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import StepIndicator from '../components/StepIndicator';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Hotel, Star, CheckCircle, ArrowLeft, MapPin } from 'lucide-react';
import './Booking.css';

const STEPS = ['Stay Details', 'Review', 'Confirmed'];

export default function HotelBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [form, setForm] = useState({ checkIn: today, checkOut: tomorrow, rooms: 1, guestName: '', guestPhone: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/hotels/${id}`)
      .then(({ data }) => setHotel(data.hotel))
      .catch(() => { toast.error('Hotel not found'); navigate('/hotels'); })
      .finally(() => setLoading(false));
  }, [id]);

  const nights = Math.max(1, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000));
  const total = hotel ? hotel.pricePerNight * nights * form.rooms : 0;

  const validate = () => {
    const e = {};
    if (!form.guestName.trim()) e.guestName = 'Guest name is required';
    if (new Date(form.checkOut) <= new Date(form.checkIn)) e.checkOut = 'Check-out must be after check-in';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep(1);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        type: 'hotel', hotelId: id,
        checkIn: form.checkIn, checkOut: form.checkOut, rooms: form.rooms,
        passengers: [{ name: form.guestName }],
      });
      setBooking(data.booking);
      setStep(2);
      toast.success('Hotel booked! 🏨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading hotel details..." />;

  return (
    <div className="page">
      <div className="container booking-container">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => step > 0 && step < 2 ? setStep(step - 1) : navigate('/hotels')}>
          <ArrowLeft size={15} /> {step > 0 && step < 2 ? 'Back' : 'Back to Hotels'}
        </button>

        <StepIndicator steps={STEPS} current={step} />

        {step === 0 && (
          <div className="booking-layout fade-in">
            <form className="booking-main card" onSubmit={handleReview}>
              <h2 className="booking-section-title"><Hotel size={18} /> Stay Details</h2>
              <div className="passenger-fields">
                <div className="form-group">
                  <label className="form-label">Check-in Date</label>
                  <input type="date" className="form-input" value={form.checkIn} min={today}
                    onChange={e => setForm({ ...form, checkIn: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Check-out Date</label>
                  <input type="date" className={`form-input ${errors.checkOut ? 'error' : ''}`} value={form.checkOut} min={form.checkIn}
                    onChange={e => setForm({ ...form, checkOut: e.target.value })} required />
                  {errors.checkOut && <span className="form-error">{errors.checkOut}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Rooms</label>
                  <select className="form-input" value={form.rooms} onChange={e => setForm({ ...form, rooms: Number(e.target.value) })}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Primary Guest Name</label>
                <input className={`form-input ${errors.guestName ? 'error' : ''}`} placeholder="Full name" value={form.guestName}
                  onChange={e => { setForm({ ...form, guestName: e.target.value }); setErrors({ ...errors, guestName: '' }); }} required />
                {errors.guestName && <span className="form-error">{errors.guestName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone (optional)</label>
                <input className="form-input" placeholder="+91 98765 43210" value={form.guestPhone}
                  onChange={e => setForm({ ...form, guestPhone: e.target.value })} />
              </div>
              <div className="divider" />
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Review Booking</button>
            </form>

            <HotelSummary hotel={hotel} nights={nights} rooms={form.rooms} total={total} />
          </div>
        )}

        {step === 1 && (
          <div className="booking-layout fade-in">
            <div className="booking-main card">
              <h2 className="booking-section-title">Review Your Booking</h2>
              <div className="review-section">
                <h4>Hotel Details</h4>
                <div className="review-row"><span>Hotel</span><span>{hotel.name}</span></div>
                <div className="review-row"><span>City</span><span>{hotel.city}</span></div>
                <div className="review-row"><span>Rating</span><span>{'★'.repeat(hotel.rating)}</span></div>
              </div>
              <div className="review-section">
                <h4>Stay Details</h4>
                <div className="review-row"><span>Check-in</span><span>{form.checkIn}</span></div>
                <div className="review-row"><span>Check-out</span><span>{form.checkOut}</span></div>
                <div className="review-row"><span>Duration</span><span>{nights} night{nights > 1 ? 's' : ''}</span></div>
                <div className="review-row"><span>Rooms</span><span>{form.rooms}</span></div>
                <div className="review-row"><span>Guest</span><span>{form.guestName}</span></div>
              </div>
              <div className="review-section">
                <div className="review-row total"><span>Total Amount</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleConfirm} disabled={submitting}>
                {submitting ? 'Confirming...' : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}
              </button>
            </div>
            <HotelSummary hotel={hotel} nights={nights} rooms={form.rooms} total={total} />
          </div>
        )}

        {step === 2 && booking && (
          <div className="confirmation-box card fade-in">
            <CheckCircle size={56} className="confirm-icon" />
            <h2>Hotel Booked!</h2>
            <p className="confirm-ref">Booking Reference: <strong>{booking.bookingRef}</strong></p>
            <div className="confirm-details">
              <div className="review-row"><span>Hotel</span><span>{hotel.name}</span></div>
              <div className="review-row"><span>Check-in</span><span>{form.checkIn}</span></div>
              <div className="review-row"><span>Check-out</span><span>{form.checkOut}</span></div>
              <div className="review-row"><span>Rooms</span><span>{form.rooms}</span></div>
              <div className="review-row total"><span>Total Paid</span><span>₹{booking.totalPrice.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="confirm-actions">
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>View My Bookings</button>
              <button className="btn btn-ghost" onClick={() => navigate('/')}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HotelSummary({ hotel, nights, rooms, total }) {
  return (
    <div className="booking-summary card">
      <h3 className="summary-title"><Hotel size={16} /> Price Summary</h3>
      <div className="divider" />
      <div className="summary-row"><span>{hotel.name}</span></div>
      <div className="summary-row"><span><MapPin size={12} /> {hotel.city}</span></div>
      <div className="summary-row"><span>{'★'.repeat(hotel.rating)}</span></div>
      <div className="divider" />
      <div className="summary-row"><span>₹{hotel.pricePerNight.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span></div>
      <div className="summary-row"><span>{rooms} room{rooms > 1 ? 's' : ''}</span></div>
      <div className="divider" />
      <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
    </div>
  );
}
