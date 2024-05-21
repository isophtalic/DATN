'use client'
import React, { useEffect, useRef, useState } from 'react'

import { columns } from './columns'
import { DataTable } from './data-table'
import { PaginationState } from '@tanstack/react-table'
import { Skeleton } from "@/components/ui/skeleton"
import { InitialPaginationState } from '@/store/constants/const'
import { useRouter } from 'next/navigation'


import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AccesslistAPI from '@/apis/accesslist'

async function getData(pagination: PaginationState): Promise<any> {
    let result: any[] = []
    try {
        const response = await AccesslistAPI.list(pagination)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

const AccesslistTable = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationState>(InitialPaginationState)
    const [data, setData] = useState<AccesslistInterface[]>([]);
    const [pageCount, setPageCount] = useState<number>(1);

    // const initData = await getData(initialStatePagination)

    // let dataRef = useRef<ProxyViewer[]>([])

    const handlePaginationChange = (pagination: PaginationState) => {
        setLoading(true);
        // console.log("🚀 ~ handlePaginationChange ~ pagination:", pagination)
        setPagination(() => pagination)
    }

    const router = useRouter()

    const handleBtnCreate = () => {
        router.push("/dashboards/accesslist/new")
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(false);
            var newData
            try {
                newData = await getData(pagination)
                console.log("🚀 ~ fetchData ~ newData:", newData)
            } catch (error) {
                console.log("🚀 ~ fetchData ~ error:", error)
                return
            }

            if (newData !== undefined) {
                setPageCount(newData.total_pages ?? 1)
                setData(newData.records ?? []);
            }
        }
        fetchData()
    }, [pagination])



    return (
        <div>

            <div>
                <div>
                    <div>
                        <h1 className='font-normal text-xl md:text-xl mb-3 flex items-center mt-8'>
                            <span>Accesslist</span>
                        </h1>
                    </div>
                    <div className="flex">
                        <div className='relative h-9 w-full md:w-1/3 md:flex-shrink-0 mb-6 mb-6'>
                            <MagnifyingGlassIcon className='inline-block absolute ml-2 mt-1 text-gray-400' width={20} height={24} />
                            <Input data-testid="search-input" className="appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full dark:focus:bg-gray-800 appearance-none rounded-full h-8 pl-10 w-full focus:bg-white focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full dark:focus:bg-gray-800" placeholder="Search" type="search" spellCheck="false" aria-label="Search"></Input>
                        </div>
                        <div className="w-full flex items-center mb-6">
                            <div className="flex-shrink-0 ml-auto">
                                <Button className="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300 font-bold" style={{ backgroundColor: "rgb(14,165,233)" }} onClick={handleBtnCreate}>Create Accesslist</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className="flex flex-col space-y-3 mt-20 ml-20">
                        <Skeleton className="h-[150px] w-[300px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ) : (

                    <DataTable columns={columns} data={data} pageCount={pageCount} pagination={pagination} onSetPagination={handlePaginationChange} />
                )}
            </div>

        </div>
    )
}

export default AccesslistTable
