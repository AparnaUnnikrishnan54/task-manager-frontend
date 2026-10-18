import { useState } from 'react'
import './App.css'
import { Route ,Routes} from 'react-router-dom'
import Home from './pages/Home'
import CalendarView from './pages/CalendarView'


function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/calendar" element={<CalendarView />} />
    </Routes>
      
    
    </>
  )
}

export default App
