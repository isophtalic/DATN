'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getProxyColumns } from './columns'
import { DataTable } from './data-table'
import { PaginationState } from '@tanstack/react-table'
import { Skeleton } from "@/components/ui/skeleton"
import { DebounceValue, InitialPaginationState } from '@/store/constants/const'
import { useRouter, useParams } from 'next/navigation'


import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from "@uidotdev/usehooks";
import AccesslistAPI from '@/apis/accesslist'
import ProxyAPI from '@/apis/proxy'
import { toast } from '@/components/ui/use-toast'

async function getData(id: string, pagination: PaginationState): Promise<any> {
    try {
        const response = await AccesslistAPI.showProxies(id, pagination)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

const deleteProxy = async (id: string, refreshData: () => void) => {
    try {
        const res = await ProxyAPI.deleteByID(id);
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
};

async function searchData(id: string, pagination: PaginationState, valueSearch: string): Promise<any> {
    try {
        const response = await AccesslistAPI.showProxies(id, pagination, valueSearch)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

const ProxiesTable = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationState>(InitialPaginationState)
    const [data, setData] = useState<ProxyViewer[]>([]);
    const [pageCount, setPageCount] = useState<number>(1);
    const [valueSearch, setValueSearch] = useState<string>("")
    const debouncedSearchTerm = useDebounce(valueSearch, DebounceValue);

    // const initData = await getData(initialStatePagination)

    // let dataRef = useRef<ProxyViewer[]>([])

    const handlePaginationChange = (pagination: PaginationState) => {
        setLoading(true);
        setPagination(() => pagination)
    }

    const router = useRouter()
    const params = useParams()
    let secruleset_id = params.id
    if (Array.isArray(secruleset_id)) {
        secruleset_id = secruleset_id[0]
    }

    const handleBtnCreate = () => {
        router.push("/dashboards/proxy/new")
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const newData = await getData(secruleset_id, pagination);
            if (newData) {
                setPageCount(newData.total_pages ?? 1);
                setData(newData.records ?? []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const search = async () => {
        setLoading(true);
        try {
            const newData = await searchData(secruleset_id, pagination, valueSearch);
            if (newData) {
                setPageCount(newData.total_pages ?? 1);
                setData(newData.records ?? []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: any) => {
        setValueSearch(e.target.value);
    };

    useEffect(() => {
        search()
    }, [debouncedSearchTerm])

    useEffect(() => {
        search()
    }, [pagination])

    const onDeleteItem = useCallback((id: string) => deleteProxy(id, fetchData), [pagination]);

    const columns = useMemo(() => getProxyColumns({ onDeleteItem }), [onDeleteItem]);


    return (
        <div>

            <div>
                <div>
                    <div>
                        <h1 className='font-normal text-xl md:text-xl mb-3 flex items-center mt-8 text-gray-500'>
                            <span>Proxy</span>
                        </h1>
                    </div>
                    <div className="flex">
                        <div className='relative h-9 w-full md:w-1/3 md:flex-shrink-0 mb-6 mb-6'>
                            <MagnifyingGlassIcon className='inline-block absolute ml-2 mt-1 text-gray-400' width={20} height={24} />
                            <Input onChange={handleSearch} data-testid="search-input" className="appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full dark:focus:bg-gray-800 appearance-none rounded-full h-8 pl-10 w-full focus:bg-white focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full dark:focus:bg-gray-800" placeholder="Search" type="search" spellCheck="false" aria-label="Search"></Input>
                        </div>
                        <div className="w-full flex items-center mb-6">
                            <div className="flex-shrink-0 ml-auto">
                                <Button className="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300 font-bold" style={{ backgroundColor: "rgb(14,165,233)" }} onClick={handleBtnCreate}>Create Proxy</Button>
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

                    <DataTable columns={columns} pageCount={pageCount} data={data} pagination={pagination} onSetPagination={handlePaginationChange} />
                )}
            </div>

        </div>
    )
}

export default ProxiesTable