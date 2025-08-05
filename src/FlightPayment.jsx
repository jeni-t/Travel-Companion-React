import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

function FlightPayment({ amount }) {
    const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    // people: "",
    // fromDate: "",
    // toDate: "",
    paymentMethod: "",
    // aadhar: "",
    // amounts:"",
  });

  // Fetch clientSecret from backend
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Flight Booking Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Full Name" className="w-full border p-2 rounded" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="w-full border p-2 rounded" required onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Mobile Number" className="w-full border p-2 rounded" required onChange={handleChange} />
        {/* <input type="number" name="people" placeholder="No. of People" className="w-full border p-2 rounded" required onChange={handleChange} /> */}

        {/* <div className="flex gap-4">
          <input type="date" name="fromDate" className="w-1/2 border p-2 rounded" required onChange={handleChange} />
          <input type="date" name="toDate" className="w-1/2 border p-2 rounded" required onChange={handleChange} />
        </div> */}
{/* <input type="number" name="amounts" placeholder="Amount" className="w-full border p-2 rounded" required onChange={handleChange} /> */}
        <select name="paymentMethod" className="w-full border p-2 rounded" required onChange={handleChange}>
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
      </form>
    </div>
  );
}

export default FlightPayment;
