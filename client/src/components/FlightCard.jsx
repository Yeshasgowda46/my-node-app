import { useNavigate } from 'react-router-dom';
import { Plane, Clock, ArrowRight } from 'lucide-react';
import './FlightCard.css';

const AIRLINE_COLORS = {
  IndiGo: '#1a56db', 'Air India': '#e11d48', SpiceJet: '#f97316', Vistara: '#7c3aed',
};

export default function FlightCard({ flight }) {
  const navigate = useNavigate();
  const color = AIRLINE_COLORS[flight.airline] || '#2563eb';

  return (
    <div className="flight-card card fade-in">
      <div className="flight-card-header" style={{ borderLeftColor: color }}>
        <div className="airline-info">
          <div className="airline-dot" style={{ background: color }} />
          <div>
            <div className="airline-name">{flight.airline}</div>
            <div className="flight-number">{flight.flightNumber}</div>
          </div>
        </div>
        <span className={`badge ${flight.class === 'Business' ? 'badge-blue' : flight.class === 'First' ? 'badge-orange' : 'badge-gray'}`}>
          {flight.class}
        </span>
      </div>

      <div className="flight-route">
        <div className="route-point">
          <div className="route-time">{flight.departureTime}</div>
          <div className="route-city">{flight.from}</div>
        </div>
        <div className="route-middle">
          <div className="route-duration"><Clock size={12} /> {flight.duration}</div>
          <div className="route-line">
            <div className="route-dot" />
            <div className="route-dash" />
            <Plane size={14} style={{ color: 'var(--primary)' }} />
            <div className="route-dash" />
            <div className="route-dot" />
          </div>
          <div className="route-label">Non-stop</div>
        </div>
        <div className="route-point right">
          <div className="route-time">{flight.arrivalTime}</div>
          <div className="route-city">{flight.to}</div>
        </div>
      </div>

      <div className="flight-card-footer">
        <div className="price-block">
          <span className="price-label">per person</span>
          <span className="price">₹{flight.price.toLocaleString('en-IN')}</span>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/book-flight/${flight._id}`)}>
          Book Now <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
