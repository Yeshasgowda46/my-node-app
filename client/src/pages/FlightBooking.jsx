import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import StepIndicator from '../components/StepIndicator';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Plane, User, CheckCircle, ArrowLeft } from 'lucide-react';
import './Booking.css';

const STEPS = ['Passengers', 'Review', 'Confirmed'];

export default function FlightBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male' }]);

  useEffect(() => {
    api.get(`/flights/${id}`)
      .then(({ data }) => setFlight(data.flight))
      .catch(() => { toast.error('Flight not found'); navigate('/flights'); })
      .finally(() => setLoading(false));
  }, [id]);

  const updatePassenger = (i, field, value) => {
    const updated = [...passengers];
    updated[i] = { ...updated[i], [field]: value };
    setPassengers(updated);
  };

  const addPassenger = () => setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
  const removePassenger = (i) => setPassengers(passengers.filter((_, idx) => idx !== i));

  const validatePassengers = () => passengers.every(p => p.name.trim() && p.age);

  const handleReview = (e) => {
    e.preventDefault();
    if (!validatePassengers()) { toast.error('Fill all passenger details'); return; }
    setStep(1);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        type: 'flight', flightId: id,
        passengers: passengers.map(p => ({ ...p, age: Number(p.age) })),
      });
      setBooking(data.booking);
      setStep(2);
      toast.success('Booking confirmed! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading flight details..." />;

  return (
    <div className="page">
      <div className="container booking-container">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => step > 0 && step < 2 ? setStep(step - 1) : navigate('/flights')}>
          <ArrowLeft size={15} /> {step > 0 && step < 2 ? 'Back' : 'Back to Flights'}
        </button>

        <StepIndicator steps={STEPS} current={step} />

        {step === 0 && (
          <div className="booking-layout fade-in">
            <form className="booking-main card" onSubmit={handleReview}>
              <h2 className="booking-section-title"><User size={18} /> Passenger Details</h2>
              {passengers.map((p, i) => (
                <div key={i} className="passenger-form">
                  <div className="passenger-header">
                    <span className="passenger-label">Passenger {i + 1}</span>
                    {i > 0 && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => removePassenger(i)}>Remove</button>
                    )}
                  </div>
                  <div className="passenger-fields">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" placeholder="As on ID" value={p.name}
                        onChange={e => updatePassenger(i, 'name', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input type="number" className="form-input" placeholder="25" min="1" max="120" value={p.age}
                        onChange={e => updatePassenger(i, 'age', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-input" value={p.gender} onChange={e => updatePassenger(i, 'gender', e.target.value)}>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={addPassenger} style={{ marginTop: 8 }}>
                + Add Passenger
              </button>
              <div className="divider" />
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Review Booking
              </button>
            </form>

            <FlightSummary flight={flight} passengers={passengers.length} />
          </div>
        )}

        {step === 1 && (
          <div className="booking-layout fade-in">
            <div className="booking-main card">
              <h2 className="booking-section-title">Review Your Booking</h2>
              <div className="review-section">
                <h4>Flight Details</h4>
                <div className="review-row"><span>Flight</span><span>{flight.airline} {flight.flightNumber}</span></div>
                <div className="review-row"><span>Route</span><span>{flight.from} → {flight.to}</span></div>
                <div className="review-row"><span>Date</span><span>{flight.date}</span></div>
                <div className="review-row"><span>Time</span><span>{flight.departureTime} – {flight.arrivalTime}</span></div>
                <div className="review-row"><span>Class</span><span>{flight.class}</span></div>
              </div>
              <div className="review-section">
                <h4>Passengers</h4>
                {passengers.map((p, i) => (
                  <div key={i} className="review-row">
                    <span>Passenger {i + 1}</span>
                    <span>{p.name}, {p.age}y, {p.gender}</span>
                  </div>
                ))}
              </div>
              <div className="review-section">
                <div className="review-row total">
                  <span>Total Amount</span>
                  <span>₹{(flight.price * passengers.length).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleConfirm} disabled={submitting}>
                {submitting ? 'Confirming...' : 'Confirm & Pay ₹' + (flight.price * passengers.length).toLocaleString('en-IN')}
              </button>
            </div>
            <FlightSummary flight={flight} passengers={passengers.length} />
          </div>
        )}

        {step === 2 && booking && (
          <div className="confirmation-box card fade-in">
            <CheckCircle size={56} className="confirm-icon" />
            <h2>Booking Confirmed!</h2>
            <p className="confirm-ref">Booking Reference: <strong>{booking.bookingRef}</strong></p>
            <div className="confirm-details">
              <div className="review-row"><span>Flight</span><span>{flight.airline} {flight.flightNumber}</span></div>
              <div className="review-row"><span>Route</span><span>{flight.from} → {flight.to}</span></div>
              <div className="review-row"><span>Date</span><span>{flight.date}</span></div>
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

function FlightSummary({ flight, passengers }) {
  return (
    <div className="booking-summary card">
      <h3 className="summary-title"><Plane size={16} /> Fare Summary</h3>
      <div className="divider" />
      <div className="summary-row"><span>{flight.airline} {flight.flightNumber}</span></div>
      <div className="summary-row"><span>{flight.from} → {flight.to}</span></div>
      <div className="summary-row"><span>{flight.date} | {flight.departureTime}</span></div>
      <div className="summary-row"><span>{flight.class}</span></div>
      <div className="divider" />
      <div className="summary-row"><span>Base fare × {passengers}</span><span>₹{(flight.price * passengers).toLocaleString('en-IN')}</span></div>
      <div className="summary-row"><span>Taxes & fees</span><span>Included</span></div>
      <div className="divider" />
      <div className="summary-row total"><span>Total</span><span>₹{(flight.price * passengers).toLocaleString('en-IN')}</span></div>
    </div>
  );
}
