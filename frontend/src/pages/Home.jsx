import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import ListCard from '../components/ListCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isCreateModel, setIsCreateModel] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const [userdata, setUserData] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/getUserDetails`, {
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
          setUserData(data.user);
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, []);

  const createProject = async (e) => {
    e.preventDefault(); 
    if (projectTitle.trim() === "") {
      toast.error("Please Enter Project Title");
    } else {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/createProject`, {
          mode:"cors",
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: projectTitle,
            userId: localStorage.getItem("userId")
          })
        }).then(res=>res.json()).then(data=>{
          if (data.success) {
            setIsCreateModel(false);
            setProjectTitle("");
            toast.success("Project Created Successfully");
            navigate(`editor/${data.projectId}`);
          } else {
            console.log(data.message);
            toast.error("Something went wrong");
          }
        })
       
      } catch (error) {
        console.error("Error creating project:", error);
        toast.error("An error occurred while creating the project");
      }
    }
  };

  const getProject =()=>{
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/getProjects`,{
      mode:"cors",
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId")
          })
    }).then(res=>res.json()).then(data=>{
          if(data.success){
            setData(data.projects)
          }else{
            toast.error("Something is wrong")
          }
    })
  }

  useEffect(()=>{
    getProject();
  },[])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = data ? data.filter(project => project.title.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-between text-white px-[100px] my-[40px]'>
        <h2 className='text-2xl'>Hi,{userdata?userdata.name : " "}</h2>
        <div className='w-[350px] flex items-center gap-1'>
          <div className="inputbox w-full bg-[#141414] border-[5px] flex items-center">
            <input type="text" placeholder='search' className='searchBox text-black flex-1 p-[8px]' value={searchTerm} onChange={handleSearch} />
          </div>
          <button onClick={() => setIsCreateModel(true)} className='rounded-sm bg-[#00ADEF] px-4 py-2 text-[20px]'>+</button>
        </div>
      </div>
      <div className="cards">
        {
          filteredProjects.length > 0 ? filteredProjects.map((item,index)=>{
                 return <ListCard key={index} item={item} />
          }) : "No projects found"
        }
        
      </div>
      {isCreateModel && (
        <div className="createmodel text-white fixed top-0 bottom-0 right-0 left-0 w-screen h-screen bg-[rgb(0,0,0,0.2)] flex items-center justify-center">
          <div className='w-[29vw] h-[33vh] shadow-lg shadow-black/50 bg-[#141414] rounded-[10px] p-[20px]'>
            <h3 className="text-3xl text-white">Create New Project?</h3>
            <div className='mt-[30px] ml-[6px]'>
              <input type="text" onChange={(e) => setProjectTitle(e.target.value)} value={projectTitle} placeholder='Project Title' className='pr-2 h-[40px] w-full rounded-sm bg-[#202020]' />
            </div>
            <div className='flex items-center w-full gap-[10px] mt-2'>
              <button onClick={createProject} className='btnblue rounded-[5px] mt-3 bg-[#2b96c1] !p-[5px] w-[49%] !px-[10px]'>Create</button>
              <button onClick={() => setIsCreateModel(false)} className='btnblue bg-[#1A1919] rounded-[5px] mt-3 w-[49%] !p-[5px] !px-[10px]'>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
