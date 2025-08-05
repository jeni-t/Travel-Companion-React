import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [isBlogOpen, setBlogOpen] = useState(false);
  const [isPagesOpen, setPagesOpen] = useState(false);

  return (
    <header className="relative z-10">
      <nav className="bg-black bg-opacity-60 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-2 font-bold text-xl">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-green-600" />
          <span>Travelista</span>
        </div>

        <ul className="flex space-x-6 font-medium">
          <li className="hover:text-yellow-400 cursor-pointer">HOME</li>
          <li className="hover:text-yellow-400 cursor-pointer"><Link to="/place">PLACES</Link></li>
          <li className="hover:text-yellow-400 cursor-pointer">PACKAGES</li>
          <li className="hover:text-yellow-400 cursor-pointer">FLIGHT BOOKING</li>
          <li className="hover:text-yellow-400 cursor-pointer">HOTELS</li>  

          {/* <li
            className="relative group"
            onMouseEnter={() => setBlogOpen(true)}
            onMouseLeave={() => setBlogOpen(false)}
          >
            <span className="cursor-pointer hover:text-yellow-400">BLOG ▾</span>
            {isBlogOpen && (
              <ul className="absolute top-8 left-0 bg-white text-black p-2 rounded shadow-md space-y-1 w-32">
                <li className="hover:bg-gray-100 px-2 py-1">Blog 1</li>
                <li className="hover:bg-gray-100 px-2 py-1">Blog 2</li>
              </ul>
            )}
          </li> */}

          {/* <li
            className="relative group"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            <span className="cursor-pointer hover:text-yellow-400">PAGES ▾</span>
            {isPagesOpen && (
              <ul className="absolute top-8 left-0 bg-white text-black p-2 rounded shadow-md space-y-1 w-32">
                <li className="hover:bg-gray-100 px-2 py-1">Page 1</li>
                <li className="hover:bg-gray-100 px-2 py-1">Page 2</li>
              </ul>
            )}
          </li> */}

          <li className="hover:text-yellow-400 cursor-pointer">CONTACT</li>
        </ul>
      </nav>

      {/* Hero section below navbar */}
      <div
        className="relative h-[250px] bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')`
        }}
      >
        <h1 className="text-4xl font-bold mb-2">Tour Packages</h1>
        <p className="text-sm flex items-center gap-2">
          Home <span>➤</span> <span className="font-medium">Tour Packages</span>
        </p>
      </div>
    </header>
  );
}

export default Home;
