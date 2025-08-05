import { useEffect, useState } from "react"

function FlightBookingHistory(){

const [bookingData, setBookingData] = useState([]);

useEffect(()=>{
    fetch("http://localhost:5000/api/flightbooking/flighthistory")
    .then((res)=>res.json())
    .then((data)=>setBookingData(data))
},[])

return(
<>
{
    bookingData.map((booking, index) => (
        <div key={index}>
        <p><strong>Name:</strong>{booking.name}</p>,
                <p><strong>Email:</strong>{booking.email}</p>,
                <p><strong>Phone:</strong>{booking.phone}</p>,
                <p><strong>From:</strong>{booking.from}</p>,
                <p><strong>to:</strong>{booking.to}</p>,
                <p><strong>Amount:</strong>{booking.amount}</p>,
                <p><strong>date:</strong>{booking.date}</p>,
                <p><strong>seat:</strong>{booking.seat}</p>,
                <p><strong>time:</strong>{booking.time}</p>
                </div>
    ))
}
</>
)
}
export default FlightBookingHistory