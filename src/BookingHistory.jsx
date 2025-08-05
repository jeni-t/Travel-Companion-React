import { useEffect, useState } from "react";

function BookingHistory() {
  const [bookingData, setBookingData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings/history")
      .then((res) => res.json())
      .then((data) => setBookingData(data));
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData(bookingData[index]);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const result = await response.json();
      if (response.ok) {
        const updatedBookings = [...bookingData];
        updatedBookings[editIndex] = result;
        setBookingData(updatedBookings);
        setEditIndex(null);
      } else {
        alert("Update failed: " + result.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong!");
    }
  };

  const handleDelete= async(id)=>{
    try{
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`,{
        method:"DELETE"
      })
      const result = await res.json()
      if(res.ok){
        alert("Booking deleted")
        setBookingData((prev)=>prev.filter((b)=>b._id !==id))
      }else{
         alert("Delete failed: " + result.error);
      }
    }catch(err){
      alert("Something went wrong!");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Booking History</h2>

      {bookingData.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        bookingData.map((booking, index) => (
          <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50 shadow-sm">
            {editIndex === index ? (
              <>
                <input name="name" value={editData.name} onChange={handleChange} className="border p-1 w-full" />
                <input name="email" value={editData.email} onChange={handleChange} className="border p-1 w-full" />
                <input name="phone" value={editData.phone} onChange={handleChange} className="border p-1 w-full" />
                <input name="fromDate" value={editData.fromDate} onChange={handleChange} className="border p-1 w-full" />
                <input name="toDate" value={editData.toDate} onChange={handleChange} className="border p-1 w-full" />
                <input name="people" value={editData.people} onChange={handleChange} className="border p-1 w-full" />
                <input name="aadhar" value={editData.aadhar} onChange={handleChange} className="border p-1 w-full" />
                <input name="amounts" value={editData.amounts} onChange={handleChange} className="border p-1 w-full" />

                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleSave(booking._id)} className="bg-green-500 px-3 py-1 text-white rounded">Save</button>
                  <button onClick={handleCancel} className="bg-gray-500 px-3 py-1 text-white rounded">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {booking.name}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
                <p><strong>From:</strong> {booking.fromDate}</p>
                <p><strong>To:</strong> {booking.toDate}</p>
                <p><strong>People:</strong> {booking.people}</p>
                <p><strong>Aadhar:</strong> {booking.aadhar}</p>
                <p><strong>Amount:</strong> ₹{booking.amounts}</p>
                <button onClick={() => handleEdit(index)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(booking._id)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default BookingHistory;
