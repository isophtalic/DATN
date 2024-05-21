import React from 'react'

const Note = () => {
    return (
        <div className='flex flex-col md:col-span-8 rounded-lg h-full shadow p-5 w-max' style={{ backgroundColor: "#fff" }}>
            <div className="top">
                <h2 style={{ fontSize: 'large' }}>What is an Access List?</h2>
                <hr style={{ padding: "10px" }} />
            </div>
            <div className="bottom text-gray-800">
                <p>Access Lists provide a blacklist or whitelist of specific client IP addresses along with authentication for the Proxy Hosts via Basic HTTP Authentication.</p>
                <p>You can configure multiple client rules, usernames and passwords for a single Access List and then apply that to a Proxy Host. </p>
                <p>This is most useful for forwarded web services that do not have authentication mechanisms built in or that you want to protect from access by unknown clients.</p>
            </div>
        </div>
    )
}

export default Note