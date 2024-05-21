'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import SecRuleAPI from '@/apis/secruleset'
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



const fetchDataSecRuleDetail = async (id: string) => {
    try {
        const response = await SecRuleAPI.detail(id)
        console.log("🚀 ~ fetchDataSecRuleDetail ~ response:", response)
        return response.data
    } catch (error) {
        console.log(error)
        return undefined
    }
}

const SecRuleDetail = () => {
    const router = useParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<SecRuleInterface>({
        secrule_id: "",
        name: "",
        created_at: "",
        updated_at: "",
        debug_log_level: 3
    });

    let SecRuleID = router.id
    if (Array.isArray(SecRuleID)) {
        SecRuleID = SecRuleID[0]
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(false);
            let SecRuleDetail = await fetchDataSecRuleDetail(SecRuleID)
            if (SecRuleDetail === undefined) {
                return
            }
            setData(SecRuleDetail);
        }
        fetchData()
    }, [SecRuleID])

    console.log(data);


    return (
        <div>
            <div className=''>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-bold' style={{ color: "rgb(14,165,233)" }} href="/dashboards/security_rule_sets">Security Rule Sets</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/dashboards/security_rule_sets/" + SecRuleID}>Security Rule Detail</BreadcrumbLink>
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
                            <DetailPage data={data} proxy_id={SecRuleID}></DetailPage>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default SecRuleDetail