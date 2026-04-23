require('dotenv').config();
const { createStore } = require('../db/store');

const flightStore = createStore('flights');
const hotelStore = createStore('hotels');

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const d0 = fmt(today);
const d1 = fmt(new Date(today.getTime() + 86400000));
const d2 = fmt(new Date(today.getTime() + 2 * 86400000));

const flights = [
  { airline: 'IndiGo', flightNumber: '6E-201', from: 'Delhi', to: 'Mumbai', departureTime: '06:00', arrivalTime: '08:10', duration: '2h 10m', price: 3499, class: 'Economy', date: d0, seats: 50 },
  { airline: 'Air India', flightNumber: 'AI-101', from: 'Delhi', to: 'Mumbai', departureTime: '09:30', arrivalTime: '11:45', duration: '2h 15m', price: 4999, class: 'Economy', date: d0, seats: 50 },
  { airline: 'SpiceJet', flightNumber: 'SG-301', from: 'Delhi', to: 'Mumbai', departureTime: '13:00', arrivalTime: '15:20', duration: '2h 20m', price: 3199, class: 'Economy', date: d0, seats: 50 },
  { airline: 'Vistara', flightNumber: 'UK-801', from: 'Delhi', to: 'Mumbai', departureTime: '17:45', arrivalTime: '19:55', duration: '2h 10m', price: 6999, class: 'Business', date: d0, seats: 20 },
  { airline: 'IndiGo', flightNumber: '6E-505', from: 'Mumbai', to: 'Bangalore', departureTime: '07:15', arrivalTime: '08:45', duration: '1h 30m', price: 2799, class: 'Economy', date: d0, seats: 50 },
  { airline: 'Air India', flightNumber: 'AI-505', from: 'Mumbai', to: 'Bangalore', departureTime: '11:00', arrivalTime: '12:35', duration: '1h 35m', price: 3599, class: 'Economy', date: d0, seats: 50 },
  { airline: 'Vistara', flightNumber: 'UK-202', from: 'Mumbai', to: 'Bangalore', departureTime: '15:30', arrivalTime: '17:00', duration: '1h 30m', price: 5499, class: 'Business', date: d0, seats: 20 },
  { airline: 'IndiGo', flightNumber: '6E-701', from: 'Bangalore', to: 'Chennai', departureTime: '08:00', arrivalTime: '09:10', duration: '1h 10m', price: 1999, class: 'Economy', date: d0, seats: 50 },
  { airline: 'SpiceJet', flightNumber: 'SG-601', from: 'Bangalore', to: 'Hyderabad', departureTime: '10:30', arrivalTime: '11:45', duration: '1h 15m', price: 2299, class: 'Economy', date: d0, seats: 50 },
  { airline: 'Air India', flightNumber: 'AI-301', from: 'Delhi', to: 'Kolkata', departureTime: '06:45', arrivalTime: '09:15', duration: '2h 30m', price: 4299, class: 'Economy', date: d0, seats: 50 },
  { airline: 'IndiGo', flightNumber: '6E-202', from: 'Delhi', to: 'Mumbai', departureTime: '06:00', arrivalTime: '08:10', duration: '2h 10m', price: 3699, class: 'Economy', date: d1, seats: 50 },
  { airline: 'SpiceJet', flightNumber: 'SG-302', from: 'Delhi', to: 'Mumbai', departureTime: '14:00', arrivalTime: '16:20', duration: '2h 20m', price: 3399, class: 'Economy', date: d1, seats: 50 },
  { airline: 'IndiGo', flightNumber: '6E-506', from: 'Mumbai', to: 'Bangalore', departureTime: '08:00', arrivalTime: '09:30', duration: '1h 30m', price: 2999, class: 'Economy', date: d1, seats: 50 },
  { airline: 'Vistara', flightNumber: 'UK-803', from: 'Delhi', to: 'Mumbai', departureTime: '20:00', arrivalTime: '22:10', duration: '2h 10m', price: 7499, class: 'Business', date: d1, seats: 20 },
  { airline: 'Air India', flightNumber: 'AI-102', from: 'Delhi', to: 'Mumbai', departureTime: '10:00', arrivalTime: '12:15', duration: '2h 15m', price: 5299, class: 'Economy', date: d2, seats: 50 },
];

const hotels = [
  { name: 'The Taj Mahal Palace', city: 'Mumbai', address: 'Apollo Bunder, Colaba, Mumbai', rating: 5, pricePerNight: 18000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Bar'], description: 'Iconic luxury hotel overlooking the Gateway of India.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { name: 'ITC Grand Central', city: 'Mumbai', address: 'Dr Babasaheb Ambedkar Road, Parel, Mumbai', rating: 5, pricePerNight: 12000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'], description: 'Luxury hotel in the heart of Mumbai with exceptional dining.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800' },
  { name: 'Trident Nariman Point', city: 'Mumbai', address: 'Nariman Point, Mumbai', rating: 4, pricePerNight: 8500, amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym', 'Business Center'], description: 'Contemporary hotel with stunning sea views.', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
  { name: 'The Leela Palace', city: 'Delhi', address: 'Diplomatic Enclave, Chanakyapuri, New Delhi', rating: 5, pricePerNight: 20000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'], description: 'Palatial luxury hotel in the diplomatic enclave.', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800' },
  { name: 'Hyatt Regency Delhi', city: 'Delhi', address: 'Bhikaiji Cama Place, Ring Road, New Delhi', rating: 4, pricePerNight: 9000, amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym', 'Bar'], description: 'Modern hotel with excellent connectivity and vibrant dining.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800' },
  { name: 'The Imperial New Delhi', city: 'Delhi', address: 'Janpath, New Delhi', rating: 5, pricePerNight: 15000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'], description: 'A heritage landmark blending colonial grandeur with modern luxury.', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800' },
  { name: 'The Oberoi Bangalore', city: 'Bangalore', address: 'MG Road, Bangalore', rating: 5, pricePerNight: 14000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'], description: 'Elegant luxury hotel on MG Road with lush gardens.', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800' },
  { name: 'Taj MG Road', city: 'Bangalore', address: '41/3 MG Road, Bangalore', rating: 4, pricePerNight: 10000, amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym', 'Bar'], description: 'Stylish hotel in the commercial hub with great dining.', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800' },
  { name: 'Lemon Tree Premier', city: 'Bangalore', address: 'Ulsoor Road, Bangalore', rating: 3, pricePerNight: 4500, amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym'], description: 'Comfortable mid-range hotel with great value for money.', image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800' },
  { name: 'ITC Grand Chola', city: 'Chennai', address: 'Mount Road, Chennai', rating: 5, pricePerNight: 13000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Bar'], description: 'Inspired by the grandeur of the Chola dynasty.', image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800' },
  { name: 'Novotel Hyderabad', city: 'Hyderabad', address: 'HICC Complex, Madhapur, Hyderabad', rating: 4, pricePerNight: 7000, amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym', 'Business Center'], description: 'Contemporary hotel adjacent to the convention center.', image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800' },
  { name: 'Vivanta Kolkata', city: 'Kolkata', address: 'EM Bypass, Kolkata', rating: 4, pricePerNight: 8000, amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym', 'Spa'], description: 'Modern luxury hotel with panoramic city views.', image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800' },
];

// Clear existing and re-seed
const fs = require('fs');
const path = require('path');
const DB_DIR = path.join(__dirname, '../../db');
['flights.json', 'hotels.json'].forEach((f) => {
  const fp = path.join(DB_DIR, f);
  if (fs.existsSync(fp)) fs.writeFileSync(fp, '[]');
});

flights.forEach((f) => flightStore.insert(f));
hotels.forEach((h) => hotelStore.insert(h));

console.log(`✅ Seeded ${flights.length} flights and ${hotels.length} hotels into /db`);
process.exit(0);
