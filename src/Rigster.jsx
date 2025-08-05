import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import regsiter from "../public/travel_register.jpg"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register (){
const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name:"", lastname:"", email:"", password:"", phone:""
    })

    const handleChange = (e)=>{
        setFormData(prev=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(res.data.msg || "Registered successfully");
    } catch (err) {
      console.log("Register error:", err);
    if (err.response && err.response.data && err.response.data.msg) {
      alert(err.response.data.msg);
    } else {
      alert("Server not responding or unknown error occurred.");
    }
    }
}
return(
    <>
    <img src={regsiter} className="w-full h-screen object-cover opacity-60"/>
    <form onSubmit={handleSubmit} className="p-4">
    <div className="absolute inset-0 flex items-center justify-center">
    <div className="bg-slate-800 bg-opacity-90 p-10 rounded-lg shadow-lg w-[500px] ...">
        <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
 <input className="bg-white w-full h-10 px-2 rounded" name="name" placeholder="First Name" onChange={handleChange} />
              <input className="bg-white w-full h-10 px-2 rounded" name="lastname" placeholder="Last Name" onChange={handleChange} />
</div>
<input className="bg-white w-full h-10 px-2 rounded" name="email" placeholder="Email" onChange={handleChange}/>
            <input className="bg-white w-full h-10 px-2 rounded" name="phone" placeholder="Phone" onChange={handleChange}/>
            <input className="bg-white w-full h-10 px-2 rounded" name="password" placeholder="Password" onChange={handleChange}/>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={()=>navigate("/home")} className="bg-yellow-500 py-2">Register</button>
                <Link to="/login"><button className="bg-yellow-500 w-full py-2">Login</button></Link>
            </div>
</div>
</div>
</div>
</form>
    </>
)
}

export default Register