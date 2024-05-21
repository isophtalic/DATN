'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import DetailPage from './detail'
import DataRuleAPI from '@/apis/datarule'



const fetchDataRuleDetail = async (id: string) => {
    try {
        const response = await DataRuleAPI.detail(id)
        console.log("🚀 ~ fetchDataProxyDetail ~ response:", response)
        return response.data
    } catch (error) {
        console.log(error)
        return undefined
    }
}

const RuleDetail = () => {
    const router = useParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<DataRuleInterface>({
        data_id: "",
        secrule_id: "",
        created_at: "",
        updated_at: "",
        name: "",
        description: "",
        content: "",
    });

    let dataid = router.dataid
    console.log("🚀 ~ RuleDetail ~ id:", dataid)
    if (Array.isArray(dataid)) {
        dataid = dataid[0]
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(false);
            let ruleDetail = await fetchDataRuleDetail(dataid)
            if (ruleDetail === undefined) {
                return
            }
            setData(ruleDetail);
        }
        fetchData()
    }, [dataid])

    console.log("🚀 ~ RuleDetail ~ data:", data)


    return (
        <div>
            <div className=''>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-bold pointer-events-none' style={{ color: "rgb(14,165,233)" }} href="/dashboards/accesslist" >RuleSet</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='pointer-events-none' href={"/accesslist/" + dataid}>RuleSet Detail</BreadcrumbLink>
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
                            <DetailPage data={data} dataid={dataid}></DetailPage>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default RuleDetail