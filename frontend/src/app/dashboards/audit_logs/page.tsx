import React from 'react'
import AuditLogsTable from './table/auditlogs_table'

const MainDashboards = () => {
    return (
        <div className="relative p-10 h-[100%]">
            <div>
                <AuditLogsTable />
            </div>
        </div>

    )
}

export default MainDashboards