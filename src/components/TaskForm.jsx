import React, { useState,useEffect } from 'react'
import axios from 'axios'

function TaskForm({onTaskAdded,editTask,onTaskUpdated}) {

    const [formData,setFormData]=useState({
        title:'',
        priority:'',
        status:'',
        dueDate:''
    })

    //When you click Edit, the selected task's details will fill the form automatically
    useEffect(()=>{
        if(editTask){
            setFormData({
                title:editTask.title||'',
                priority:editTask.priority||'',
                status:editTask.status||'',
                dueDate:editTask.dueDate||''
            })
        }
    },[editTask])

    const handleChange=(e)=>{
        const {name,value}=e.target
        setFormData({...formData,[name]:value})
    }


    
    const handleSubmit=async (e)=>{
        e.preventDefault()
      //prevent users from submitting a task title containing only spaces  
        if (!formData.title.trim()) {
            alert("Please enter a valid task title.")
            return
        }

        // Send the form data to the backend
        try {
            if(editTask){
                // Update an existing task
                await axios.put(`https://task-manager-backend-89ks.onrender.com/tasks/${editTask.id}`,{...formData,title: formData.title.trim()})
                await onTaskUpdated()
                alert('Task updated successfully!');
            }
            else{
                // Add a new task
                await axios.post('https://task-manager-backend-89ks.onrender.com/tasks',{...formData,title: formData.title.trim()})
                await onTaskAdded()
                alert('Task added successfully!')
            }
           
            // Clear the form after adding the task
            setFormData({
                title:'',priority:'',status:'',dueDate:''
            })

        } catch (error) {
            alert(editTask ? 'Failed to update task' : 'Failed to add task')
            console.log(error);
            
        }
    }
    //then Connect this function to your form so use onsubmit




  return (
    <div className='card mb-4' 
    style={{backgroundColor:"white",border:"1px solid #dce5f2",borderRadius:"12px",boxShadow: "0 4px 12px rgba(25, 50, 85, 0.06)",padding:"24px"}}>

        {/* form heading */}
        <div style={{color:"#cb7746",fontSize: "1.25rem",fontWeight: "700",marginBottom:"20px"}}>
            {editTask ? "Update Task Details" : "Create a New Task"}
        </div>

        {/* form */}
       <form onSubmit={handleSubmit}>

            {/* task title */}
            <div className='mb-3'>
                <label htmlFor="" className='form-label task-label'>Task Title</label>
                <input type="text" className='form-control task-input ' placeholder="Enter task title"
                name='title' onChange={handleChange} value={formData.title} required/>
            </div>
            {/* priority */}
            <div className='mb-3'>
                <label htmlFor="" className='form-label task-label'>Priority</label>
                <select className='form-select task-input ' name='priority' onChange={handleChange} value={formData.priority} required>
                    <option value="" disabled>Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            {/* status */}
            <div className='mb-3'>
                <label htmlFor="" className='form-label task-label'>Status</label>
                <select className='form-select task-input ' name='status' onChange={handleChange} value={formData.status} required>
                    <option value="" disabled>Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            {/* duedate */}
            <div className='mb-3'>
                <label htmlFor="" className='form-label task-label'>Due Date</label>
                <input type="date" className='form-control task-input '
                name='dueDate' onChange={handleChange} value={formData.dueDate} required/>
            </div>
            {/* button */}
            <button type='submit' className='btn' 
                style={{backgroundColor:"#2878ff",color:'white',border: "none",borderRadius: "8px",padding: "10px 20px",fontWeight:'600'}}>
                {editTask ? "Update Task" : "Add Task"}
            </button>
       </form>
        
    </div>
    
  )
}

export default TaskForm