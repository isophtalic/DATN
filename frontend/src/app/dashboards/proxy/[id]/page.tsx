'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProxyAPI from '@/apis/proxy'
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
        const response = await ProxyAPI.detail(id)
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
    const [data, setData] = useState<ProxyViewerDetail>({
        proxy_id: "",
        status: true,
        cache: true,
        accesslist_id: "",
        secrule_id: "",
        created_at: "",
        updated_at: "",
        source: {
            source_id: "",
            proxy_id: "",
            created_at: "undefined",
            updated_at: "undefined",
            hostname: '',
            port: ''
        },
        destination: {
            destination_id: '',
            source_id: '',
            scheme: 'http',
            ip: '',
            forward_port: '',
            created_at: "undefined",
            updated_at: "undefined"
        },
        secrule: {
            secrule_id: '',
            created_at: "undefined",
            updated_at: "undefined",
            name: '',
            debug_log_level: 0
        },
        accesslist: {
            accesslist_id: '',
            name: '',
            updated_at: "undefined"
        }
    });

    let idProxy = router.id
    if (Array.isArray(idProxy)) {
        idProxy = idProxy[0]
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(false);
            let proxyDetail = await fetchDataProxyDetail(idProxy)
            if (proxyDetail === undefined) {
                return
            }
            setData(proxyDetail);
        }
        fetchData()
    }, [idProxy])

    console.log(data);


    return (
        <div>
            <div className=''>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-bold' style={{ color: "rgb(14,165,233)" }} href="/dashboards/proxy">Proxy</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/proxy/" + idProxy}>Proxy Detail</BreadcrumbLink>
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
                            <DetailPage data={data} proxy_id={idProxy}></DetailPage>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default ProxyDetail