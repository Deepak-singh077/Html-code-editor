import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const ListCard = ({ item }) => {

  const [isDeleteModel, setIsDeleteModel] = useState(false)
 const navigate= useNavigate();
  const deleteProj=(id)=>{
    const apiUrl = import.meta.env.VITE_API_URL;
  fetch(apiUrl+"/deleteProject",{
    mode:"cors",
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      projId:id,
      userId: localStorage.getItem("userId")
      })
  }).then(res=>res.json()).then(data=>{
    if(data.success){
      setIsDeleteModel(false)
      window.location.reload()
    }else{
      setIsDeleteModel(false)
      toast.error(data.message)
    }
  })
 }
  return (
    <>
      <div className='w-full mb-2 pr-10 mx-3 p-[10px] bg-[#141414] rounded-lg cursor-pointer hover:bg-[#202020] flex items-center justify-between'>
        <div onClick={()=>{navigate(`/editor/${item._id}`)}} className='flex items-center gap-2'>
          <img src="/code.png" alt="" className='w-[80px]' />
          <div><h3 className='text-[22px] text-white'>{item.title}</h3>
          <p className='text-gray-500 text-[14px]'>Created {new Date(item.date).toDateString()}</p>
          </div>
        </div>
        <div>
          <img src="/delete.png" alt="" onClick={() => setIsDeleteModel(true)} className='w-[36px] mr-4 cursor-pointer' />
        </div>
      </div>
      {isDeleteModel && (
        <div className="model fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.1)] flex justify-center items-center flex-col">
          <div className="mainModel w-[30vw] h-[30vh] bg-[#141414] rounded-lg p-[20px]">
            <h3 className='text-3xl text-white'>Do you want to delete <br />this project?</h3>
            <div className='flex items-center w-full gap-3 mt-4'>
              <button onClick={()=>{deleteProj(item._id)}} className='p-3 mt-2 rounded-lg bg-red-600 min-w-[49%]'>Delete</button>
              <button onClick={() => setIsDeleteModel(false)} className='p-3 mt-2 rounded-lg bg-gray-500 min-w-[49%]'>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ListCard
