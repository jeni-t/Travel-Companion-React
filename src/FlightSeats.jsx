// import React, { useState } from "react";
// import axios from "axios";

// const FlightSeats = () => {
//   const [flightNumber, setFlightNumber] = useState("");
//   const [departureDate, setDepartureDate] = useState("");
//   const [cabinClass, setCabinClass] = useState("ECONOMY");
//   const [seatMap, setSeatMap] = useState(null);
//   const [selectedSeat, setSelectedSeat] = useState(null);
//   const [message, setMessage] = useState("");

//   const fetchSeats = async () => {
//     setSeatMap(null);
//     setMessage("");

//     try {
//       const res = await axios.post("http://localhost:5000/api/seats", {
//         flightNumber,
//         departureDate,
//         cabinClass,
//       });

//       setSeatMap(res.data);
//     } catch (err) {
//       console.error("Seat fetch error:", err.message);
//       setMessage("❌ Failed to load seats");
//     }
//   };

//   const handleSeatSelect = (seat) => {
//     if (!seat.available) return;
//     setSelectedSeat(seat.seatNumber);
//     setMessage(`✅ Seat ${seat.seatNumber} selected. Booking confirmed.`);
//   };

//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial" }}>
//       <h2>🎫 Flight Seat Booking</h2>

//       <div style={{ marginBottom: "20px" }}>
//         <input
//           type="text"
//           placeholder="Flight Number (e.g. AI101)"
//           value={flightNumber}
//           onChange={(e) => setFlightNumber(e.target.value)}
//           style={{ marginRight: "10px", padding: "8px" }}
//         />

//         <input
//           type="date"
//           value={departureDate}
//           onChange={(e) => setDepartureDate(e.target.value)}
//           style={{ marginRight: "10px", padding: "8px" }}
//         />

//         <select
//           value={cabinClass}
//           onChange={(e) => setCabinClass(e.target.value)}
//           style={{ marginRight: "10px", padding: "8px" }}
//         >
//           <option value="ECONOMY">Economy</option>
//           <option value="BUSINESS">Business</option>
//         </select>

//         <button onClick={fetchSeats} style={{ padding: "10px 20px" }}>
//           View Seats
//         </button>
//       </div>

//       {seatMap && (
//         <div>
//           <h3>🛫 Flight {seatMap.flightNumber} - {seatMap.cabinClass}</h3>
//           <p>Departure Date: {seatMap.departureDate}</p>

//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: "10px",
//               marginTop: "20px",
//             }}
//           >
//             {seatMap.seats.map((seat) => (
//               <button
//                 key={seat.seatNumber}
//                 onClick={() => handleSeatSelect(seat)}
//                 disabled={!seat.available}
//                 style={{
//                   padding: "10px",
//                   minWidth: "60px",
//                   backgroundColor: !seat.available
//                     ? "#ccc"
//                     : selectedSeat === seat.seatNumber
//                     ? "#2e86de"
//                     : "#2ecc71",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "6px",
//                   cursor: seat.available ? "pointer" : "not-allowed",
//                 }}
//               >
//                 {seat.seatNumber}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {message && (
//         <div style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</div>
//       )}
//     </div>
//   );
// };

// export default FlightSeats;


import React, { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const FlightSeats = ({amount}) => {
const navigate = useNavigate();
const stripe = useStripe();
  const elements = useElements();
   const [clientSecret, setClientSecret] = useState("");
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    travelClass: "ECONOMY",
    adults: 1,
     name: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });
 //const [form, setForm] = useState()

const [flights, setFlights] = useState([]);
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState("");

   useEffect(() => {
    if (formData.paymentMethod === "Credit Card" || formData.paymentMethod === "Debit Card") {
      fetch("http://localhost:5000/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => {
          console.error("Payment intent error:", err);
          alert("Failed to initiate payment.");
        });
    }
  }, [amount, formData.paymentMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const getIataCode = async (city) => {
    const res = await axios.get(`http://localhost:5000/api/iata?city=${city}`);
    return res.data.iataCode;
  };

    const searchFlights = async () => {
    try {
      const originCode = await getIataCode(formData.from);
      const destCode = await getIataCode(formData.to);

      const res = await axios.get("http://localhost:5000/api/flights", {
        params: {
          origin: originCode,
          destination: destCode,
          date: formData.date,
          adults: formData.adults,
          travelClass: formData.travelClass,
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
 // };

  //const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.paymentMethod === "Credit Card" ||
      formData.paymentMethod === "Debit Card"
    ) {
      if (!stripe || !elements) return;

      if (!clientSecret) {
        alert("Payment not ready yet. Try again.");
        return;
      }

      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      if (result.paymentIntent.status !== "succeeded") {
        alert("Payment failed.");
        return;
      }

      alert("Payment successful!");
    }

    try {
      const response = await fetch("http://localhost:5000/api/flightbooking/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Booking submitted successfully!");
        console.log("Booking saved:", result);
      } else {
        alert("Booking failed: " + result.error);
      }
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    }
  };

    const fetchSeats = async (flight) => {
    const flightNumber =
      flight.itineraries[0].segments[0].carrierCode +
      flight.itineraries[0].segments[0].number;

    try {
      const res = await axios.post("http://localhost:5000/api/seats", {
        flightNumber,
        departureDate: formData.date,
        cabinClass: formData.travelClass,
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

  const handleBook = async () => {
  const bookingDetails = {
    userId: currentUser._id,
    from: selectedFlight.from,
    to: selectedFlight.to,
    amount: selectedFlight.price,
    date: selectedFlight.date,
    seat: selectedFlight.seat,
    time: selectedFlight.time,
    flightNumber: selectedFlight.flightNumber,
    passengerName: currentUser.name
  };

  try {
    await axios.post('/api/bookings/book', bookingDetails);
    alert('Booking confirmed and saved to history!');
  } catch (error) {
    console.error('Error saving booking:', error);
  }
};


    return (
      <>
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Flight Booking Form</h2>
      <form onSubmit={searchFlights} className="space-y-4">
         <div style={{ padding: "20px" }}>
      <h2>🔍 Search Flights</h2>
      <input
        name="from"
        placeholder="From"
        onChange={handleInputChange}
        value={formData.from}
      />
      <input
        name="to"
        placeholder="To"
        onChange={handleInputChange}
        value={formData.to}
      />
      <input
        name="date"
        type="date"
        onChange={handleInputChange}
        value={formData.date}
      />
      <select name="travelClass" onChange={handleInputChange} value={formData.travelClass}>
        <option value="ECONOMY">Economy</option>
        <option value="BUSINESS">Business</option>
      </select>
      <input
        name="adults"
        type="number"
        min={1}
        onChange={handleInputChange}
        value={formData.adults}
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
        {/* <div>
         <button className="bg-blue-500" onClick={() => navigate("/flightpayment")}>Book Now</button>
         </div> */}

                 <input type="text" name="name" placeholder="Full Name" className="w-full border p-2 rounded" required onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Email" className="w-full border p-2 rounded" required onChange={handleInputChange} />
        <input type="tel" name="phone" placeholder="Mobile Number" className="w-full border p-2 rounded" required onChange={handleInputChange} />
        {/* <input type="number" name="people" placeholder="No. of People" className="w-full border p-2 rounded" required onChange={handleChange} /> */}

        {/* <div className="flex gap-4">
          <input type="date" name="fromDate" className="w-1/2 border p-2 rounded" required onChange={handleChange} />
          <input type="date" name="toDate" className="w-1/2 border p-2 rounded" required onChange={handleChange} />
        </div> */}
{/* <input type="number" name="amounts" placeholder="Amount" className="w-full border p-2 rounded" required onChange={handleChange} /> */}
        <select name="paymentMethod" className="w-full border p-2 rounded" required onChange={handleInputChange}>
          <option value="">-- Select Payment Method --</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="Cash on Arrival">Cash on Arrival</option>
        </select>

        {(formData.paymentMethod === "Credit Card" || formData.paymentMethod === "Debit Card") && (
          <div className="space-y-2">
            <CardElement className="border p-2 rounded" />
          </div>
        )}

        {/* <input type="text" name="aadhar" placeholder="Aadhar Number" className="w-full border p-2 rounded" required onChange={handleChange} /> */}

        <button type="submit" disabled={!stripe && (formData.paymentMethod === "Credit Card" || formData.paymentMethod === "Debit Card")} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Book Now
        </button>
         <button type="submit" onClick={()=>navigate("/flightbookinghistory")} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          View History
        </button>
        </div>
      )}
     
    </div>
      </form>
    </div>

    
    </>
  );

}
export default FlightSeats;