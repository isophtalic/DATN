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
import RuleAPI from '@/apis/ruleset'



const fetchDataRuleDetail = async (id: string) => {
    try {
        const response = await RuleAPI.detail(id)
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
    const [data, setData] = useState<RuleSetInterface>({
        rule_id: "",
        secrule_id: "",
        created_at: "",
        updated_at: "",
        id: 0,
        file: "",
        content: "",
        status: 0,
    });

    let rule_id = router.ruleid
    console.log("🚀 ~ RuleDetail ~ id:", rule_id)
    if (Array.isArray(rule_id)) {
        rule_id = rule_id[0]
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(false);
            let ruleDetail = await fetchDataRuleDetail(rule_id)
            if (ruleDetail === undefined) {
                return
            }
            setData(ruleDetail);
        }
        fetchData()
    }, [rule_id])

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
                            <BreadcrumbLink className='pointer-events-none' href={"/accesslist/" + rule_id}>RuleSet Detail</BreadcrumbLink>
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
                            <DetailPage data={data} rule_id={rule_id}></DetailPage>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default RuleDetail