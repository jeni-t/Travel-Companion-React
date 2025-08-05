import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FlightSearch = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    travelClass: "ECONOMY",
    adults: 1,
  });

  const [flights, setFlights] = useState([]);
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getIataCode = async (city) => {
    const res = await axios.get(`http://localhost:5000/api/iata?city=${city}`);
    return res.data.iataCode;
  };

  const searchFlights = async () => {
    try {
      const originCode = await getIataCode(form.from);
      const destCode = await getIataCode(form.to);

      const res = await axios.get("http://localhost:5000/api/flights", {
        params: {
          origin: originCode,
          destination: destCode,
          date: form.date,
          adults: form.adults,
          travelClass: form.travelClass,
        },
      });

      setFlights(res.data);
      setSeatMap(null);
      setSelectedSeat(null);
      setMessage("");
    } catch (err) {
      console.error("❌ Error fetching flights:", err.message);
      setMessage("Failed to fetch flights.");
    }
  };

  const fetchSeats = async (flight) => {
    const flightNumber =
      flight.itineraries[0].segments[0].carrierCode +
      flight.itineraries[0].segments[0].number;

    try {
      const res = await axios.post("http://localhost:5000/api/seats", {
        flightNumber,
        departureDate: form.date,
        cabinClass: form.travelClass,
      });

      setSeatMap(res.data);
      setSelectedSeat(null);
      setMessage("");
    } catch (err) {
      console.error("❌ Seat fetch error:", err.message);
      setMessage("❌ Failed to load seats");
    }
  };

  const handleSeatSelect = (seat) => {
    if (!seat.available) return;
    setSelectedSeat(seat.seatNumber);
   // setMessage(`✅ Seat ${seat.seatNumber} selected. Booking confirmed.`);
    setMessage(`✅ Booking confirmed.`);
  };

  const handleSubmit = async(e)=>{
    e.preventDefault()
    
    try{
      const response = await fetch("http://localhost:5000/api/flightbooking/flightdetails",{
        method:"POST",
        headers:{
           "Content-Type": "application/json",
        },
         body: JSON.stringify(form),
      })
      const result = await response.json();
      if (response.ok) {
        alert("Booking submitted successfully!");
        console.log("Booking saved:", result);
      } else {
        alert("Booking failed: " + result.error);
      }
    }catch(err){
      alert("Something went wrong!");
      console.error(err);
    }
  }
  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 Search Flights</h2>
      
      <input
        name="from"
        placeholder="From"
        onChange={handleInputChange}
        value={form.from}
      />
      <input
        name="to"
        placeholder="To"
        onChange={handleInputChange}
        value={form.to}
      />
      <input
        name="date"
        type="date"
        onChange={handleInputChange}
        value={form.date}
      />
      <select name="travelClass" onChange={handleInputChange} value={form.travelClass}>
        <option value="ECONOMY">Economy</option>
        <option value="BUSINESS">Business</option>
      </select>
      <input
        name="adults"
        type="number"
        min={1}
        onChange={handleInputChange}
        value={form.adults}
      />
      <button onClick={searchFlights}>Search</button>
      <ul>
        {flights.map((flight, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            ✈️ {flight.itineraries[0].segments[0].departure.iataCode} →{" "}
            {flight.itineraries[0].segments[0].arrival.iataCode} <br />
            📅 {flight.itineraries[0].segments[0].departure.at}
             💰 <strong>
        {flight.price?.total
          ? `₹${parseFloat(flight.price.total)} INR`
          : "Price not available"}
      </strong> <br />
            <button onClick={() => fetchSeats(flight)}>View Seats</button>
          </li>
        ))}
      </ul>
<form onSubmit={handleSubmit} className="space-y-4">
      {seatMap?.seats && (
        <div style={{ marginTop: "20px" }}>
          <h3>🪑 Select a Seat</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {seatMap.seats.map((seat) => (
              <button
                key={seat.seatNumber}
                onClick={() => handleSeatSelect(seat)}
                disabled={!seat.available}
                style={{
                  padding: "10px",
                  minWidth: "60px",
                  backgroundColor: !seat.available
                    ? "#ccc"
                    : selectedSeat === seat.seatNumber
                    ? "#2e86de"
                    : "#2ecc71",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: seat.available ? "pointer" : "not-allowed",
                }}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>{message}
        <div>
         <button className="bg-blue-500" onClick={() => navigate("/flightpayment")}>Book Now</button>
         </div>
        </div>
      )}
     </form>
    </div>
  );
};

export default FlightSearch;
