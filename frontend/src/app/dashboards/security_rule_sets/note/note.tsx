import React from 'react'

const Note = () => {
    return (
        <div className='flex flex-col md:col-span-8 rounded-lg h-full shadow p-5 w-max' style={{ backgroundColor: "#fff" }}>
            <div className="top">
                <h2 style={{ fontSize: 'large' }}>What is a Security Rule Set?</h2>
                <hr style={{ padding: "10px" }} />
            </div>
            <div className="bottom">
                A security rule set is a set of generic attack detection rules for use with web application firewalls such as OWASP Coraza.
            </div>
        </div>
    )
}

export default Note