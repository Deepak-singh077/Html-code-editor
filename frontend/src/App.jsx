import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Editor from './pages/Editior.jsx'
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/editor/:projectID' element={<Editor/>} />
      
    </Routes>
    
    </BrowserRouter>
      
    </>
  )
}

export default App
