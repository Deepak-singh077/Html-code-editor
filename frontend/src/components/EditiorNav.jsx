import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
 const EditiorNav = () => {
  return (
    <>
    <div className="Navbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
      <div className="logo">
        <img src="/logo.png" alt="" className='w-[150px] cursor-pointer rounded-[14px] ' />
      </div>
     <p className=' border-[1px] rounded-md border-white p-[7px]'>file/ <span className='text-gray-500'>my project</span></p>
      <i className='p-1 bg-black rounded-[5px] cursor-pointer text-[30px] border-[1px] border-white'><MdOutlineFileDownload /></i>
    </div>
    
    </>
  )
}
export default EditiorNav;
