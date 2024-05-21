'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AccesslistAPI from '@/apis/accesslist'
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



const fetchDataProxyDetail = async (id: string) => {
    try {
        const response = await AccesslistAPI.detail(id)
        console.log("🚀 ~ fetchDataProxyDetail ~ response:", response)
        return response.data
    } catch (error) {
        console.log(error)
        return undefined
    }
}

const ProxyDetail = () => {
    const router = useParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<AccesslistInterface>({
        accesslist_id: "",
        name: "",
        updated_at: ""
    });

    let accesslist_id = router.id
    if (Array.isArray(accesslist_id)) {
        accesslist_id = accesslist_id[0]
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(false);
            let proxyDetail = await fetchDataProxyDetail(accesslist_id)
            if (proxyDetail === undefined) {
                return
            }
            setData(proxyDetail);
        }
        fetchData()
    }, [accesslist_id])

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
                            <BreadcrumbLink href={"/accesslist/" + accesslist_id}>Accesslist Detail</BreadcrumbLink>
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
                            <DetailPage data={data} accesslist_id={accesslist_id}></DetailPage>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default ProxyDetail