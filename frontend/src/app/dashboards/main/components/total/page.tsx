'use client'
import React, { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"


import { ChartBarSquareIcon } from "@heroicons/react/24/solid"
import OverviewAPI from '@/apis/overview'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import BarChartCustom from '../chart/bar'
import { GetArrayDataByField } from '@/utilities/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FunnelIcon } from '@heroicons/react/24/outline'

const requestDataOverview = async (time_range: string): Promise<any> => {
    try {
        const resp = await OverviewAPI.view(time_range)
        return resp?.data
    } catch (error) {
        console.log(error);
    }
}

const TotalComponent = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [time_range, setTime_range] = useState<string>("7 days")
    const [top_attack_type, set_top_attack_type] = useState<EventCount[]>([{
        field: "",
        count: 0,
    }])

    const [top_rule_id, set_top_rule_id] = useState<EventCount[]>([{
        field: "",
        count: 0,
    }])

    const [top_by_host, set_top_by_host] = useState<EventCount[]>([{
        field: "",
        count: 0,
    }])

    const [top_by_source_attack, set_top_by_source_attack] = useState<EventCount[]>([{
        field: "",
        count: 0,
    }])

    const [data, setData] = useState<Overview>({
        total_host: 0,
        total_secure_event: 0,
        top_attack_type: top_attack_type,
        top_rule_id: top_rule_id,
        top_by_host: top_by_host,
        top_by_source_attack: top_by_source_attack
    })


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const dataServer = await requestDataOverview(time_range)
                console.log(dataServer)
                if (dataServer) {
                    setData(dataServer)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [time_range])

    const valueTime = ["7 days", "30 days", "2 months", "6 months"]

    return (
        <div>
            <div className='flex justify-end'>
                <div className='flex flex-row w-1/6 gap-2'>
                    <FunnelIcon className='w-8 h-8' />
                    <Select onValueChange={(value) => setTime_range(value)} defaultValue='7 days'>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {valueTime.map((e: string, i: number) => (
                                <SelectItem key={i} value={e} className='cursor-pointer'>{e}</SelectItem>
                            ))}
                            {/* <SelectItem key={1} value={"1"}>deny</SelectItem> */}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {
                loading ? (
                    <div className="flex flex-col space-y-3 mt-20 ml-20">
                        <Skeleton className="h-[150px] w-[300px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 gap-10 mt-8'>
                        <div className='p-8 shadow-lg' style={{ backgroundColor: " #fff", borderRadius: "20px" }}>
                            <div className='font-bold'>Total Hosts</div>
                            <div className="flex flex-row items-center mt-9">
                                <ChartBarSquareIcon style={{ width: "80px", height: "80px", color: 'rgb(53, 162, 235)' }} />
                                <div className='ml-10 text-7xl text-slate-800'>{data.total_host}<span className='text-xl'>Active</span></div>
                            </div>
                        </div >
                        <div className='p-8 shadow-lg' style={{ backgroundColor: " #fff", borderRadius: "20px" }}>
                            <div className='font-bold'>Security Events</div>
                            <div className="flex flex-row items-center mt-9">
                                <ChartBarSquareIcon style={{ width: "80px", height: "80px", color: 'rgb(53, 162, 235)' }} />
                                <div className='ml-10 text-7xl text-slate-800'>{data.total_secure_event}<span className='text-xl'>Events</span></div>
                            </div>
                        </div>
                        <div className='p-8 shadow-lg' style={{ backgroundColor: " #fff", borderRadius: "20px" }}>
                            <div className='font-bold'>Top By Atack Type</div>
                            <div className="flex flex-row items-center mt-9">
                                <BarChartCustom title='test' labels={GetArrayDataByField(data.top_attack_type, "field")} dataArray={GetArrayDataByField(data.top_attack_type, "count")} comment='Count'></BarChartCustom>
                            </div>
                        </div >
                        <div className='p-8 shadow-lg' style={{ backgroundColor: " #fff", borderRadius: "20px" }}>
                            <div className='font-bold'>Top By RuleID</div>
                            <div className="flex flex-row items-center mt-9">
                                <BarChartCustom title='test' labels={GetArrayDataByField(data.top_rule_id, "field")} dataArray={GetArrayDataByField(data.top_rule_id, "count")} comment='Count'></BarChartCustom>
                            </div>
                        </div>
                        <div className='p-8 shadow-lg' style={{ backgroundColor: " #fff", borderRadius: "20px" }}>
                            <div className='font-bold'>Top By Host</div>
                            <div className="flex flex-row items-center mt-9">
                                <BarChartCustom title='test' labels={GetArrayDataByField(data.top_by_host, "field")} dataArray={GetArrayDataByField(data.top_by_host, "count")} comment='Count'></BarChartCustom>
                            </div>
                        </div>
                        <div className='p-8 shadow-lg' style={{ backgroundColor: " #fff", borderRadius: "20px" }}>
                            <div className='font-bold'>Top By Source Attack</div>
                            <div className="flex flex-row items-center mt-9">
                                <BarChartCustom title='test' labels={GetArrayDataByField(data.top_by_source_attack, "field")} dataArray={GetArrayDataByField(data.top_by_source_attack, "count")} comment='Count'></BarChartCustom>
                            </div>
                        </div>
                    </div >
                )}
        </div>
    )
}

export default TotalComponent