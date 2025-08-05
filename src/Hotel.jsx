// const hotel = {
//   name: "Heritage Madurai",
//   image: "https://media-cdn.tripadvisor.com/media/photo-f/17/79/c9/5a/villa-over-view.jpg",
//   rating: "4.4",
//   reviews: "2885",
//   address: "11 Melakkal Main Road Near Fenner & Passport Office, Madurai 625016 India",
// };

// function Hotel() {
//   return (
//     <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden m-4">
//       <img className="w-full h-56 object-cover" src={hotel.image} alt={hotel.name} />
//       <div className="p-4 text-left">
//         <h2 className="text-xl font-bold text-gray-800">{hotel.name}</h2>
//         <p className="text-sm text-gray-600 mt-1">{hotel.address}</p>
//         <p className="text-yellow-600 font-semibold mt-2">⭐ {hotel.rating} / 5 · {hotel.reviews} reviews</p>
//         <p className="text-gray-700 mt-3">Enjoy a relaxing stay at one of Madurai's most elegant heritage hotels, known for its peaceful setting and traditional architecture.</p>
//       </div>
//     </div>
//   );
// }
// export default Hotel
// import { useEffect,useState } from "react";

// function Hotel (){
//     const [hotel, setHotel] = useState([])
// useEffect(()=>{
// fetch("https://travel-advisor.p.rapidapi.com/locations/search?query=madurai&lang=en_US",{
//     method: "GET",
//     headers:{
//         'X-RapidAPI-Key': '411ee825a7msh3a8ed732e371189p1010b2jsndd91d82558b8',
//     'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
//     }
// })
// .then((res)=>res.json())
// .then((data)=>{
// const hotel_data = data.result_object.map((item,index)=>({
// title: item.name,
// catagery:item.location_id
// }))
// setHotel(hotel_data)
// })
// },[])

// return(
//     <>
//      <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden m-4">
//       {/* <img className="w-full h-56 object-cover" src={hotel.image} alt={hotel.name} /> */}
//        <div className="p-4 text-left">
//          <h2 className="text-xl font-bold text-gray-800">{hotel.title}</h2>
//          <p className="text-sm text-gray-600 mt-1">{hotel.title}</p>
//          {/* <p className="text-yellow-600 font-semibold mt-2">⭐ {hotel.rating} / 5 · {hotel.reviews} reviews</p>
//          <p className="text-gray-700 mt-3">Enjoy a relaxing stay at one of Madurai's most elegant heritage hotels, known for its peaceful setting and traditional architecture.</p> */}
//        </div>
//      </div>
//     </>
// )
// }
// export default Hotel

import { useEffect, useState } from "react";

function Hotel() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch(
      "https://travel-advisor.p.rapidapi.com/locations/search?query=madurai&lang=en_US",
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "411ee825a7msh3a8ed732e371189p1010b2jsndd91d82558b8",
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const hotelData = data.data
          .filter((item) => item.result_type === "lodging") // only hotels
          .map((item) => ({
            title: item.result_object.name,
            category: item.result_object.category?.name,
            image: item.result_object.photo?.images?.medium?.url,
            location: item.result_object.location_string,
          }));
        setHotels(hotelData);
      });
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {hotels.map((hotel, index) => (
          <div
            key={index}
            className="max-w-md bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              className="w-full h-56 object-cover"
              src={hotel.image}
              alt={hotel.title}
            />
            <div className="grid grid-cols-2 gap-4">
            <div className="p-4 text-left">
              <h2 className="text-xl font-bold text-gray-800">{hotel.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{hotel.location}</p>
              <p className="text-sm text-gray-400 mt-1">{hotel.category}</p>
              <p className="text-yellow-600 font-semibold mt-2">5⭐</p>
            </div>
            <button className="bg-blue-900 h-10 w-30 my-8 mx-12">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Hotel;
