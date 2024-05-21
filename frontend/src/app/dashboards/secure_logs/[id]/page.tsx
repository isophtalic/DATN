'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import SecureLogsAPI from '@/apis/seclogs'
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
import { Utils } from '@/utilities/convert'



const fetchDataDetail = async (id: string) => {
    try {
        const response = await SecureLogsAPI.detail(id)
        console.log("🚀 ~ fetchDataDetail ~ response:", response)
        return response.data
    } catch (error) {
        console.log(error)
        return undefined
    }
}

const SecureLogsDetail = () => {
    const router = useParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<SecLog>({
        sec_id: "",
        created_at: "",
        client_ip: "",
        host: "",
        method: "",
        proto: "",
        uri: "",
        headers: "",
        body: "",
        form: "",
        secure_logs: "",
    });

    let seclog_id = router.id
    if (Array.isArray(seclog_id)) {
        seclog_id = seclog_id[0]
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let actions = await fetchDataDetail(seclog_id)
            console.log("🚀 ~ fetchData ~ actions:", actions)
            if (actions === undefined) {
                return
            }
            let output = Utils.ConvertArraySecLog_to_SecLog(actions)
            setData(output);
        }
        fetchData()
        setLoading(false);
    }, [seclog_id])

    console.log(data);


    return (
        <div>
            <div className=''>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-bold' style={{ color: "rgb(14,165,233)" }} href="/dashboards/secure_logs">Security Logs</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/dashboards/secure_logs/" + seclog_id}>Security Log Detail</BreadcrumbLink>
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
                            <DetailPage data={data} seclog_id={seclog_id}></DetailPage>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default SecureLogsDetail