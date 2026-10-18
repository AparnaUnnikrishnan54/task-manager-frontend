import React from 'react'

function Header() {
  return (
    <nav className='navbar' style={{ backgroundColor: "#172b4d",padding: "12px 30px",minHeight: "74px"}}>
        <div className='container-fluid d-flex align-items-center'>
          
          {/* Logo and app name */}
          <div className='d-flex align-items-center gap-3'>
            <div className='text-white d-flex align-items-center justify-content-center' 
              style={{backgroundColor:"#2878ff",borderRadius:"50%",fontSize: "24px",width:'42px',height:'42px'}}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h4 className="mb-0 text-white fw-bold" style={{ fontSize: "24px" }}>
              Task Manager
            </h4>
          </div>
        </div>
        
    </nav>
  )
}

export default Header