import axios from 'axios'
import React, { useEffect, useState } from 'react'


function CalendarView() {
    //store month
    const [currentDate, setCurrentDate] = useState(new Date())
    const month = currentDate.getMonth() // (0 = January, 11 = December)
    const year = currentDate.getFullYear()
    // Find the total number of days in the selected month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // Find the weekday of the first day (0 = Sunday)
    const firstDay = new Date(year, month, 1).getDay()

    // Create an array containing all dates in the month
    const days=Array.from({length:daysInMonth},(_,index)=>index+1)

   
  // Move to the previous month
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  // Move to the next month
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

//fetch tasks
const [tasks, setTasks] = useState([])

useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://task-manager-backend-89ks.onrender.com/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  fetchTasks()
}, [])

  return (
    <div className='container mt-4'>
        <h2>Monthly Task Calendar</h2>

         {/* Month navigation */}
        <div className='d-flex justify-content-between align-items-center mb-4'>
            <button className="btn btn-outline-primary" onClick={previousMonth}><i className="fa-solid fa-chevron-left me-2"></i>Previous</button>
            <h4>{currentDate.toLocaleString('en-US',{month:'long',year:'numeric'})}</h4>
            <button className="btn btn-outline-primary" onClick={nextMonth}><i className="fa-solid fa-chevron-right ms-2"></i>Next</button>
        </div>


        {/* Weekday headings */}
    <div className="calendar-grid text-center mb-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day}><strong>{day}</strong></div>
      ))}
    </div>

    {/* Calendar dates */}
    <div className="calendar-grid">

      {/* Empty spaces before the first date */}
      {Array.from({ length: firstDay }).map((_, index) => (
        <div key={`empty-${index}`}></div>
      ))}


    {/* DISPLAY EACH DATE */}  
    {days.map(day => {
    // Format the selected date as YYYY-MM-DD
    const dateString = [
        year, String(month + 1).padStart(2, '0'), String(day).padStart(2, '0')
    ].join('-')

    // Find tasks due on this date
    const dayTasks = tasks.filter(task => task.dueDate === dateString )

    return (
        <div className="calendar-day" key={day}>
            <strong>{day}</strong>
            {dayTasks.map(task => (
                <div key={task.id} className="badge bg-primary d-block mt-2 text-wrap">
                    {task.title}
                </div>
            ))}
        </div>
    )
    })}


    </div>
    </div>
  )
}

export default CalendarView