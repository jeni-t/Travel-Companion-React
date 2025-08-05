import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// import PaymentForm from './PaymentForm';

const stripePromise = loadStripe("pk_test_51R10Ho06LkHADKb61Fv2EeBhzwqsxG2cx8Pl7YgCwOwPkf0XApZv4wNM2FM5UmBJaU6EQwQhNi9zI8jiIk4uE8hU00lyVJozWc");
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './Rigster'
import Login from "./Login";
import Home from "./Home";
import Places from "./Places";
import Madurai from "./Madurai";
import Chennai from "./Chennai";
import Bengaluru from "./Bengaluru";
import Coimbatore from "./Coimbatore";
// import Thanjavur from "./Thanjavur";
// import Kanyakumari from "./Kanyakumari";
import Hotel from "./Hotel";
import BookNow from "./BookNow";
import BookingHistory from './BookingHistory'
import FlightSearch from './FlightSearch'
import FlightSeats from './FlightSeats'
import FlightPayment from './FlightPayment'
import FlightBookingHistory from './FlightBookingHistory'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
     <Routes>
 <Route path="/" element={<Register />} />
 <Route path="/login" element={<Login />} />
 <Route path="/home" element={<Home />} />
 <Route path="/place" element={<Places />} />
 <Route path="/madurai" element={<Madurai />} />
 <Route path="/chennai" element={<Chennai />} />
 <Route path="/bengaluru" element={<Bengaluru />} />
 <Route path="/coimbatore" element={<Coimbatore />} />
 {/* <Route path="/thanjavur" element={<Thanjavur />} />
 <Route path="/kanyakumari" element={<Kanyakumari />} /> */}
 <Route path="/hotel" element={<Hotel/>}/>
 <Route path="/booknow" element={
 <Elements stripe={stripePromise}>
      <BookNow amount={50000} /> {/* ₹500 */}
    </Elements>
    }/>
    <Route path="/booking_history" element = {<BookingHistory/>}/>
    <Route path="/flightsearch" element = {<FlightSearch/>}/>
    <Route path="/flightseats" element = {<FlightSeats/>}/>
    <Route path="/flightpayment" element={
 <Elements stripe={stripePromise}>
      <FlightPayment amount={50000} /> {/* ₹500 */}
    </Elements>
    }/>
    <Route path="/flightbookinghistory" element = {<FlightBookingHistory/>}/>
     </Routes>
    </Router>
  )
}

export default App
