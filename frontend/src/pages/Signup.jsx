import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: ""
    });
    const { username, name, email, password } = formData;
    
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitForm = async (e) => {
      const apiUrl = import.meta.env.VITE_API_URL;
         console.log(apiUrl);
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/signup`, {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success === 'success') {
                alert("Account created successfully");
                navigate("/login");
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('There was an error!', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-between px-[100px] bg-[#0D0C0C]">
            <div className="leftdiv w-[40%]">
                <img src="/logo.png" alt="logo" className="w-[200px]" />
                <form onSubmit={submitForm} className="w-full mt-[70px]">
                    {['username', 'name', 'email', 'password'].map((field, index) => (
                        <div className="inputbox w-full bg-[#141414] border-[5px] flex items-center" key={index}>
                            <input
                                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                placeholder={field}
                                className="flex-1 p-[8px]"
                            />
                        </div>
                    ))}
                    <p className="text-[#00ADEF] hover:text-[#0489bd]">
                        Already have an account? <Link to="/login">login</Link>
                    </p>
                    <p className="text-red-500 text-[14px] my-2">{error}</p>
                    <button type="submit" className="flex-1 p-[8px] bg-[#00ADEF] rounded-[50px] text-center justify-center pl-[70px] pr-[70px]">
                        Signup
                    </button>
                </form>
            </div>
            <div className="rightdiv h-screen w-[55%]">
                <img src="/authPageSide.png" className="h-full w-full object-cover" alt="Side Visual" />
            </div>
        </div>
    );
};

export default Signup;
