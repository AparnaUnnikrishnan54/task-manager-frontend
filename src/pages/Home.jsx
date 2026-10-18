import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import axios from 'axios'
import { Link } from 'react-router-dom'



function Home() {
    // Store the tasks received from the backend
    const [tasks, setTasks] = useState([])


    // Card SORTING
    // Store the selected sorting option
    const [sortBy, setSortBy] = useState("default")

    const sortedTasks = [...tasks].sort((a, b) => {
        //sort by due date -places earlier due dates first
        if (sortBy === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate)
        }

        //sort by priority
        if (sortBy === 'priority') {
            const priorityOrder = { High: 1, Medium: 2, Low: 3 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        //sort by recently added
        if (sortBy === 'recent') {
            return Number(b.id) - Number(a.id)
        }

        //default
        return 0
    })


    // Fetch tasks when the Home page loads
    const fetchTasks = async () => { //to get tasks using Axios
        try {
            const response = await axios.get('https://task-manager-backend-89ks.onrender.com/tasks')
            setTasks(response.data)

        } catch (error) {
            console.log('Error fetching tasks:', error);
        }
    }
    //to fetch them when Home loads
    useEffect(() => {
        fetchTasks()
    }, [])



    //Add state to show or hide the form
    const [showForm, setShowForm] = useState(false)
    //now Update the Add Task button showForm is false initially, so the form is hidden.Clicking the button changes it to true, so the form appears.Clicking again hides the form and changes the button text to Cancel or + Add Task


    // Delete a task using its ID
    const handleDelete = async (id) => {
        // Ask for confirmation before deleting
        const confirmDlt = window.confirm('Are you sure you want to delete this task?')
        if (confirmDlt) {
            // Delete the task from JSON Server
            await axios.delete(`https://task-manager-backend-89ks.onrender.com/tasks/${id}`)
            // Fetch the updated task list
            fetchTasks()
            alert('Task deleted successfully!')
        }

    }

    // Store the task selected for editing
    const [editTask, setEditTask] = useState(null)
    // Select a task to edit
    const handleEdit = (task) => {
        setEditTask(task)
        setShowForm(true)
    }


    //greeting
    const currentTime = new Date().getHours()
    const greeting = currentTime < 12 ? "Good morning!" :
        currentTime < 17 ? "Good afternoon!"
            : "Good evening!"


    //duedate indication
    const today = new Date()

    // Check whether a task is overdue, due today, or upcoming
    const getDueDateStatus = (dueDate) => {
        if (!dueDate) {
            return "no-date"
        }
        // Convert today's date to YYYY-MM-DD
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

        if (dueDate < todayString) {
            return "overdue"
        }
        if (dueDate === todayString) {
            return "today"
        }

        return "upcoming"
    }


    return (
        <>
            <Header />
            {/* task page */}

            {/* Greeting and add button section*/}
            {/* ------------------------------------------ */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3"
                style={{ padding: "24px 0 12px" }}>

                {/* greeting */}
                <div className='d-flex align-items-start gap-3'>
                    <i className="fa-solid fa-sun" style={{ color: "#ffb51b", fontSize: "38px", marginTop: "8px" }}></i>
                    <div>
                        <h1 className='mb-1' style={{ color: "#142d59", fontSize: "38px", fontWeight: "700" }}>
                            {greeting}
                        </h1>
                        <p className='mb-0' style={{ color: "#7183a3", fontSize: "18px" }}>Here's your productivity overview.</p>
                    </div>
                </div>

                {/* add button */}
                <button className='btn text-white btn-primary rounded-pill fw-bold' style={{ padding: "14px 24px" }}
                    onClick={() => {
                        setEditTask(null)
                        setShowForm(!showForm)
                    }}>
                    {showForm ? 'Cancel' : '+ Add New Task'}
                </button>

            </div>


            {/* task form section */}
            {/* ---------------------------- */}
            <div style={{ paddingTop: "10px", paddingBottom: "30px" }}>

                {/* Now the form appears only when you click the button . Refresh the list after adding a task*/}
                {
                    showForm && (
                        <TaskForm
                            onTaskAdded={fetchTasks}
                            editTask={editTask}
                            onTaskUpdated={async () => {
                                await fetchTasks()
                                setEditTask(null)
                                setShowForm(false)
                            }}
                        />)
                }

            </div>

            {/* task summary section*/}
            {/* ---------------------------- */}
            <div className='row g-3 mb-4'>
                {/* total task - card */}
                <div className='col-12 col-sm-6 col-xl-3'>
                    <div className='card border-0 shadow-sm rounded-3 p-3'>
                        <div className='d-flex justify-content-start align-items-center gap-3'>
                            <i class="fa-solid fa-clipboard-list" style={{ fontSize: "30px", color: "#2878ff" }}></i>
                            <div>
                                <p className="text-muted mb-2">Total Tasks</p>
                                <h3 className="fw-bold mb-2">{tasks.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/* completed tasks-card */}
                <div className='col-12 col-sm-6 col-xl-3'>
                    <div className='card border-0 shadow-sm rounded-3 p-3'>
                        <div className='d-flex justify-content-start align-items-center gap-3'>
                            <i class="fa-solid fa-check" style={{ fontSize: "30px", color: "#39b32d" }}></i>
                            <div>
                                <p className="text-muted mb-2">Completed</p>
                                <h3 className="fw-bold mb-2">
                                    {tasks.filter(task => task.status === "Completed").length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/* in progress tasks-card */}
                <div className='col-12 col-sm-6 col-xl-3'>
                    <div className='card border-0 shadow-sm rounded-3 p-3'>
                        <div className='d-flex justify-content-start align-items-center gap-3'>
                            <i class="fa-regular fa-clock " style={{ fontSize: "30px", color: "#2878ff" }}></i>
                            <div>
                                <p className="text-muted mb-2">In Progress</p>
                                <h3 className="fw-bold mb-2">
                                    {tasks.filter(task => task.status === "In Progress").length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/* pending tasks-card */}
                <div className='col-12 col-sm-6 col-xl-3'>
                    <div className='card border-0 shadow-sm rounded-3 p-3'>
                        <div className='d-flex justify-content-start align-items-center gap-3'>
                            <i class="fa-solid fa-hourglass-half" style={{ fontSize: "30px", color: "#e7a23b" }}></i>
                            <div>
                                <p className="text-muted mb-2">Pending</p>
                                <h3 className="fw-bold mb-2">{tasks.filter(task => task.status === "Pending").length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* overall progress bar */}
            {/* ----------------------------- */}
            <div className='mb-4'>
                <div className='card border-0 shadow-sm rounded-3 p-4'>

                    {/* Heading,% */}
                    <div className='d-flex justify-content-between align-items-center gap-3'>
                        <div className='d-flex align-items-center gap-3'>
                            <i class="fa-solid fa-chart-line" style={{ fontSize: "30px", color: "#2878ff" }}></i>
                            <h6 className="mb-0">Overall progress</h6>
                        </div>

                        <h4 className="fw-bold mb-2 text-end">
                            {
                                tasks.length === 0 ? 0 :
                                    Math.round(
                                        ((tasks.filter(task => task.status === 'Completed').length) / (tasks.length)) * 100
                                    )
                            }%
                        </h4>

                    </div>


                    {/* bar */}
                    <div className='progress rounded-pill' style={{ height: "10px" }} >
                        <div className='progress-bar rounded-pill'
                            role='progressbar'
                            style={{
                                height: "10px", backgroundColor: "#2878ff", transition: "width 0.4s ease",
                                width: `${tasks.length === 0 ? 0 : ((tasks.filter(task => task.status === 'Completed').length) / (tasks.length)) * 100}%`
                            }}
                            aria-valuenow={tasks.length === 0 ? 0 : Math.round((tasks.filter(task => task.status === "Completed").length / tasks.length) * 100)}
                            aria-valuemin='0'
                            aria-valuemax='100'
                        ></div>
                    </div>

                    {/* completed task count */}
                    <p className='text-muted mt-2  mb-0'>{tasks.filter(task => task.status === "Completed").length} of {tasks.length} tasks completed</p>
                </div>
            </div>


            {/* DISPLAY ALL TASKS FETCHED FROM THE BACKEND */}

            {/* Your Tasks heading and sorting dropdown */}
            <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mb-2'>
                <h3 style={{ color: "#142d59", fontWeight: "700", marginBottom: "0" }}>Your Tasks</h3>

                <div className="d-flex align-items-center gap-3 flex-wrap">
                    {/* sorting dropdown */}
                    <select className='form-select' value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: "220px" }}>
                        <option value="default">Default Order</option>
                        <option value="dueDate">Due Date: Earliest First</option>
                        <option value="priority">Priority: High to Low</option>
                        <option value="recent">Recently Added</option>
                    </select>

                    {/* calendar */}
                    <Link to="/calendar" className="btn btn-success">
                        <i className="fa-solid fa-calendar-days me-2"></i>
                        Monthly Calendar
                    </Link>
                </div>

            </div>


            <div className='row mt-4'>
                {
                    sortedTasks.map((task) => (
                        <div className='col-12 col-md-6 col-xl-4 mb-4' key={task.id}>

                            {/* TASK CARD */}
                            <div className='card task-card h-100'>

                                {/* TASK CONTENT */}
                                <div className='card-body p-4 d-flex flex-column'>

                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                        {/* task title */}
                                        <h4 className='task-title mb-0'>{task.title}</h4>

                                        {/* edit button */}
                                        <button className='btn task-edit-btn' onClick={() => handleEdit(task)} title="Edit task">
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                    </div>

                                    {/* TASK STATUS 
                        Completed → green badge with a check icon.
                        In Progress → blue badge with a clock icon.
                        Pending → amber badge with an hourglass icon.*/}
                                    <div className='mb-4'>
                                        <span className={`badge status-badge ${task.status === 'Completed' ? "status-completed" :
                                            task.status === "In Progress" ? "status-progress" :
                                                "status-pending"
                                            }`}>
                                            {task.status === 'Completed' && (<i className="fa-solid fa-check me-2"></i>)}
                                            {task.status === "In Progress" && (<i className="fa-regular fa-clock me-2"></i>)}
                                            {task.status === "Pending" && (<i className="fa-solid fa-hourglass-half me-2"></i>)}

                                            {task.status}
                                        </span>
                                    </div>

                                    {/* PRIORITY
                        High -red , Medium - amber, Low - blue */}
                                    <p className='task-details mb-3'>
                                        <i className={`fa-solid fa-flag me-2 ${task.priority === "High" ? "priority-high" :
                                            task.priority === "Medium" ? "priority-medium" :
                                                "priority-low"
                                            }`}></i>
                                        <strong>Priority: </strong>{task.priority}
                                    </p>

                                    {/* DUE DATE */}
                                    <p className='task-details mb-4'>
                                        <i className="fa-regular fa-calendar me-2"></i>
                                        <strong>Due Date: </strong>{task.dueDate}
                                        {getDueDateStatus(task.dueDate) === "overdue" && (<span className="badge bg-danger ms-2">Overdue</span>)}
                                        {getDueDateStatus(task.dueDate) === "today" && (<span className="badge bg-warning ms-2">Due today</span>)}

                                    </p>

                                    {/* DELETE BUTTON */}
                                    <div className='mt-auto pt-3 task-card-footer d-flex justify-content-end'>
                                        <button className='btn task-delete-btn' onClick={() => handleDelete(task.id)} title="Delete task">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>



                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>
            <div>
                {
                    tasks.length == 0 && (
                        <p className="text-muted text-center">No tasks available. Add your first task!</p>
                    )
                }
            </div>
        </>
    )
}

export default Home