import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar';

export const Navbar = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api_base_url}/getUserDetails`, {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId")
          })
        });
        const data = await response.json();
        if(data.success){
          setData(data.user);
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <>
      <div className="Navbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
        <div className="logo">
          <img src="/logo.png" alt="" className='w-[150px] cursor-pointer' />
        </div>
        <div className='links flex items-center text-white gap-5'>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contacts">Contacts</Link>
          <button className='logout bg-red-600 p-1 pl-2 pr-3  rounded-lg text-white hover:bg-red-700 transition-colors duration-200' onClick={handleLogout}>Log Out</button>
          <Avatar name={data ? data.name : ""} size="40" round="50%" className='cursor-pointer ml-2' />
        </div>
      </div>
    </>
  );
};
