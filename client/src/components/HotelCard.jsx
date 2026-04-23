import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Dumbbell, ArrowRight } from 'lucide-react';
import './HotelCard.css';

const AMENITY_ICONS = { WiFi: Wifi, Restaurant: Coffee, Gym: Dumbbell };

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();

  return (
    <div className="hotel-card card fade-in">
      <div className="hotel-image" style={{ backgroundImage: `url(${hotel.image})` }}>
        <div className="hotel-rating">
          <Star size={12} fill="currentColor" /> {hotel.rating}
        </div>
      </div>

      <div className="hotel-content">
        <h3 className="hotel-name">{hotel.name}</h3>
        <div className="hotel-location">
          <MapPin size={13} /> {hotel.city}
        </div>

        <div className="hotel-amenities">
          {hotel.amenities.slice(0, 3).map((a) => {
            const Icon = AMENITY_ICONS[a];
            return Icon ? <span key={a} className="amenity-icon" title={a}><Icon size={14} /></span> : null;
          })}
          {hotel.amenities.length > 3 && <span className="amenity-more">+{hotel.amenities.length - 3}</span>}
        </div>

        <div className="hotel-footer">
          <div className="price-block">
            <span className="price">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
            <span className="price-label">per night</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/book-hotel/${hotel._id}`)}>
            Book <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
