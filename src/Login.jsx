import regsiter from "../public/travel_register.jpg"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "", password: ""
  })

  const handleChange = (e) =>{
setFormData(prev=>({
    ...prev,
    [e.target.name] : e.target.value
}))
  }

  const handleSubmit= async(e)=>{
    e.preventDefault()
    try{
        const res = await axios.post("http://localhost:5000/api/auth/login", formData)
        alert(res.data.msg)
    }catch(err){
        alert(err.response?.data?.msg || "Login failed")
    }
  }

    return (
        <>
            <img src={regsiter} className="w-full h-screen object-cover opacity-60" />
             <form onSubmit={handleSubmit} className="p-4">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-slate-800 bg-opacity-90 p-10 rounded-lg shadow-lg w-[500px]">
                    <div className="grid grid-rows-3 gap-6">
                        <input className="bg-white w-full h-10 px-2 rounded" type="email" name="email" placeholder="Email" onChange={handleChange} />
                        <input className="bg-white w-full h-10 px-2 rounded" type="password" name="password" placeholder="Password" onChange={handleChange} />
                        <button onClick={()=>navigate("/home")} className="bg-yellow-500">Login</button>
                    </div>
                </div>
            </div>
            </form>
        </>
    )
}
export default Login