'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getColumns } from './columns'
import { DataTable } from './data-table'
import { PaginationState } from '@tanstack/react-table'
import { Skeleton } from "@/components/ui/skeleton"
import { InitialPaginationState } from '@/store/constants/const'
import { useRouter } from 'next/navigation'


import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import UserAPI from '@/apis/users'
import { toast } from '@/components/ui/use-toast'

async function getData(pagination: PaginationState): Promise<any> {
    let result: any[] = []
    try {
        const response = await UserAPI.view(pagination)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

async function deleteItem(id: string, refreshData: () => void) {
    try {
        const res = await UserAPI.deleteByID(id);
        if (res.success) {
            toast({
                description: "Delete Successfully",
            });
            refreshData(); // Refresh data after successful deletion
        } else {
            throw new Error(res.message);
        }
    } catch (err) {
        toast({
            variant: "destructive",
            description: `${err}`,
        });
    }
}

const UserTable = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationState>(InitialPaginationState)
    const [data, setData] = useState<UserInput[]>([]);
    const [pageCount, setPageCount] = useState<number>(1);

    // const initData = await getData(initialStatePagination)

    // let dataRef = useRef<ProxyViewer[]>([])

    const handlePaginationChange = (pagination: PaginationState) => {
        setLoading(true);
        // console.log("🚀 ~ handlePaginationChange ~ pagination:", pagination)
        setPagination(() => pagination)
    }

    const router = useRouter()


    const fetchData = async () => {
        setLoading(false);
        var newData
        try {
            newData = await getData(pagination)
            if (newData) {
                setPageCount(newData.total_pages ?? 1);
                setData(newData.records ?? []);
            }
        } catch (error) {
            console.log("🚀 ~ fetchData ~ error:", error)
            return
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [pagination])

    const onDelete = useCallback((id: string) => deleteItem(id, fetchData), [pagination]);

    const columns = useMemo(() => getColumns({ onDelete }), [onDelete]);



    return (
        <div>

            <div>
                <div>
                    <div>
                        <h1 className='font-normal text-xl md:text-xl mb-3 flex items-center'>
                            <span>Users</span>
                        </h1>
                    </div>
                    <div className="flex">
                        <div className='relative h-9 w-full md:w-1/3 md:flex-shrink-0 mb-6 mb-6'>
                            <MagnifyingGlassIcon className='inline-block absolute ml-2 mt-1 text-gray-400' width={20} height={24} />
                            <Input data-testid="search-input" className="appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full dark:focus:bg-gray-800 appearance-none rounded-full h-8 pl-10 w-full focus:bg-white focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full dark:focus:bg-gray-800" placeholder="Search" type="search" spellCheck="false" aria-label="Search"></Input>
                        </div>
                        <div className="w-full flex items-center mb-6">
                            <div className="flex-shrink-0 ml-auto">
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

export default UserTable