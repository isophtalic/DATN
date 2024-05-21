import React from 'react'
import Note from './note/note'
import SecrulesetTable from './table/srs_table'



const PageSecRuleSets = () => {
    return (
        <div className="relative p-10">
            <div className='grid md:grid-cols-12 gap-6'>
                <Note></Note>
            </div>
            <div>
                <SecrulesetTable />
            </div>
        </div>

    )
}

export default PageSecRuleSets