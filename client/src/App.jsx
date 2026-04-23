import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FlightSearch from './pages/FlightSearch';
import HotelSearch from './pages/HotelSearch';
import FlightBooking from './pages/FlightBooking';
import HotelBooking from './pages/HotelBooking';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/flights" element={<FlightSearch />} />
          <Route path="/hotels" element={<HotelSearch />} />
          <Route path="/book-flight/:id" element={<PrivateRoute><FlightBooking /></PrivateRoute>} />
          <Route path="/book-hotel/:id" element={<PrivateRoute><HotelBooking /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
