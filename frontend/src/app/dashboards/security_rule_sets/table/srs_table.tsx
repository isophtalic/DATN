'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getColumns } from './columns'
import { DataTable } from './data-table'
import { PaginationState } from '@tanstack/react-table'
import { Skeleton } from "@/components/ui/skeleton"
import { DebounceValue, InitialPaginationState } from '@/store/constants/const'
import SecRuleAPI from '@/apis/secruleset'
import { useRouter } from 'next/navigation'


import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useDebounce } from "@uidotdev/usehooks";


async function getData(pagination: PaginationState): Promise<any> {
    let result: any[] = []
    try {
        const response = await SecRuleAPI.view(pagination)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

async function searchData(pagination: PaginationState, valueSearch: string): Promise<any> {
    let result: any[] = []
    try {
        const response = await SecRuleAPI.view(pagination, valueSearch)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

async function deleteItem(id: string, refreshData: () => void) {
    try {
        const res = await SecRuleAPI.deleteByID(id);
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

const SecrulesetTable = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationState>(InitialPaginationState)
    const [data, setData] = useState<SecRuleInterface[]>([]);
    const [pageCount, setPageCount] = useState<number>(1);
    const [valueSearch, setValueSearch] = useState<string>("")
    const debouncedSearchTerm = useDebounce(valueSearch, DebounceValue);

    // const initData = await getData(initialStatePagination)

    // let dataRef = useRef<ProxyViewer[]>([])

    const handlePaginationChange = (pagination: PaginationState) => {
        setLoading(true);
        // console.log("🚀 ~ handlePaginationChange ~ pagination:", pagination)
        setPagination(() => pagination)
    }

    const router = useRouter()

    const handleBtnCreateSecRule = () => {
        router.push("/dashboards/security_rule_sets/new")
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const newData = await getData(pagination);
            if (newData) {
                setPageCount(newData.total_pages ?? 1);
                setData(newData.records ?? []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    const search = async () => {
        setLoading(false);
        var newData
        try {
            newData = await searchData(pagination, valueSearch)
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

    const handleSearch = (e: any) => {
        setValueSearch(e.target.value);
    };

    useEffect(() => {
        search()
    }, [debouncedSearchTerm])

    useEffect(() => {
        search()
    }, [pagination])

    const onDelete = useCallback((id: string) => deleteItem(id, fetchData), [pagination]);

    const columns = useMemo(() => getColumns({ onDelete }), [onDelete]);

    return (
        <div>

            <div>
                <div>
                    <div>
                        <h1 className='font-normal text-xl md:text-xl mb-3 flex items-center mt-8'>
                            <span>Security Rule Set</span>
                        </h1>
                    </div>
                    <div className="flex">
                        <div className='relative h-9 w-full md:w-1/3 md:flex-shrink-0 mb-6 mb-6'>
                            <MagnifyingGlassIcon className='inline-block absolute ml-2 mt-1 text-gray-400' width={20} height={24} />
                            <Input onChange={handleSearch} data-testid="search-input" className="appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full dark:focus:bg-gray-800 appearance-none rounded-full h-8 pl-10 w-full focus:bg-white focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600 appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full dark:focus:bg-gray-800" placeholder="Search" type="search" spellCheck="false" aria-label="Search"></Input>
                        </div>
                        <div className="w-full flex items-center mb-6">
                            <div className="flex-shrink-0 ml-auto">
                                <Button className="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300 font-bold" style={{ backgroundColor: "rgb(14,165,233)" }} onClick={handleBtnCreateSecRule}>Create Security Rule</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <Skeleton className="w-[100%] h-[50px] rounded-lg mt-10" />
                ) : (
                    <DataTable columns={columns} data={data} pageCount={pageCount} pagination={pagination} onSetPagination={handlePaginationChange} />
                )}
            </div>

        </div>
    )
}

export default SecrulesetTable