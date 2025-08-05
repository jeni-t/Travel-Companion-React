import { useEffect, useState } from "react"

function Chennai (){
const [places,setPlace] = useState([])
useEffect(()=>{
    fetch("https://api.geoapify.com/v2/places?categories=tourism&filter=circle:78.08599,9.91879,10000&limit=6&apiKey=5d3cde60df364cdaa8d29b2e93d2e32b")
    .then((res)=>res.json())
    .then((data)=>{
        const fetch_data = data.features.map((item,index)=>({
             title:item.properties.name,
      country:item.properties.address_line2,
        }))
        setPlace(fetch_data)
    })
},[])

return(
    <>
     <div className="bg-white text-center py-16 px-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Destinations</h2>
      <p className="text-gray-500 mb-12">
        We all live in an age that belongs to the young at heart. Life that is becoming extremely fast, day.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {
            places.map((place,index)=>(
                <div key={index}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg group">
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4 text-white">
              <h3 className="text-xl font-bold">{place.title}</h3>
              <p className="text-sm">{place.country}</p>
            </div>
            </div>
            ))}
      </div>
      </div>
    </>
)
}
export default Chennai