import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const submitForm = (e) => {
        e.preventDefault();
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/login`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(res => res.json())
        .then(data => {
            if(data.success === true){
                localStorage.setItem("token", data.token);
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("userId", data.userId);
                navigate("/");
            } else {
                setError(data.message);
            }
        })
    }

    return (
        <>
            <div className='w-screen min-h-screen flex items-center justify-between px-[100px] bg-[#0D0C0C]' >
                <div className="leftdiv w-[40%]" >
                    <img src="/logo.png" alt="logo" className='w-[200px]' />
                    <form onSubmit={submitForm} className='w-full mt-[70px]' >
                        <div className="inputbox w-full bg-[#141414] border-[5px] flex items-center ">
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email' className='flex-1 p-[8px]' />
                        </div>
                        <div className="inputbox w-full bg-[#141414] border-[5px] flex items-center ">
                            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder='password' className='flex-1 p-[8px]' />
                        </div>
                        <p className='text-[#00ADEF] hover:text-[#0489bd]'>Don't have an account ? <Link to="/signup">Sign-up</Link></p>
                        <p className='text-red-500 text-[14px] my-2'>{error}</p>
                        <button type='submit' className='flex-1 p-[8px] bg-[#00ADEF] rounded-[50px] text-center justify-center pl-[70px] pr-[70px]'>Login</button>
                    </form>
                </div>
                <div className="rightdiv h-screen w-[55%]">
                    <img src="/authPageSide.png" className='h-full w-full object-cover bg-blue-500' alt="" />
                </div>
            </div>
        </>
    )
}

export default Login
