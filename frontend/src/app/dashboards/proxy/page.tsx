import React from 'react'
import Note from './note/note'
import ProxyTable from './table/proxytable'



const MainDashboards = () => {
    return (
        <div className="relative p-10">
            <div className='grid md:grid-cols-12 gap-6'>
                <Note></Note>
            </div>
            <div>
                <ProxyTable />
            </div>
        </div>

    )
}

export default MainDashboards