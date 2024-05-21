'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ActionsAPI from '@/apis/actions'
import { Skeleton } from "@/components/ui/skeleton"
import DetailPage from './detail'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRightIcon } from '@heroicons/react/24/outline'



const fetchDataActionsDetail = async (id: string) => {
    try {
        const response = await ActionsAPI.detail(id)
        console.log("🚀 ~ fetchDataActionsDetail ~ response:", response)
        return response.data
    } catch (error) {
        console.log(error)
        return undefined
    }
}

const AuditLogsDetail = () => {
    const router = useParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<ActionsInterface>({
        id: "",
        name: "",
        created_at: "",
        updated_at: "",
        initiated_by: "",
        target: "",
        target_id: "",
        changes: "",
        original: "",
    });

    let action_id = router.id
    if (Array.isArray(action_id)) {
        action_id = action_id[0]
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let actions = await fetchDataActionsDetail(action_id)
            console.log("🚀 ~ fetchData ~ actions:", actions)
            if (actions === undefined) {
                return
            }
            setData(actions);
        }
        fetchData()
        setLoading(false);
    }, [action_id])

    console.log(data);


    return (
        <div>
            <div className=''>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-bold' style={{ color: "rgb(14,165,233)" }} href="/dashboards/accesslist">Accesslist</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/dashboards/audit_logs/" + action_id}>Accesslist Detail</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div>
                {loading ? (
                    <div className="flex flex-col space-y-3 mt-20 ml-20">
                        <Skeleton className="h-[150px] w-[300px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div>
                            <DetailPage data={data} action_id={action_id}></DetailPage>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default AuditLogsDetail