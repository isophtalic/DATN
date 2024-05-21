import React from 'react'

const Note = () => {
    return (
        <div className='flex flex-col md:col-span-8 rounded-lg h-full shadow p-5 w-max' style={{ backgroundColor: "#fff" }}>
            <div className="top">
                <h2 style={{ fontSize: 'large' }}>What is a Proxy Host?</h2>
                <hr style={{ padding: "10px" }} />
            </div>
            <div className="bottom">
                A proxy host is a server that acts as an intermediary between a client and a server.
            </div>
        </div>
    )
}

export default Note