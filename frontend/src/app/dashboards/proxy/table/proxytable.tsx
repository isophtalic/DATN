'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getProxyColumns } from './columns';
import { DataTable } from './data-table';
import { PaginationState } from '@tanstack/react-table';
import { Skeleton } from "@/components/ui/skeleton";
import { InitialPaginationState } from '@/store/constants/const';
import ProxyAPI from '@/apis/proxy';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useDebounce } from "@uidotdev/usehooks";

const getData = async (pagination: PaginationState): Promise<any> => {
    try {
        const response = await ProxyAPI.view(pagination);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

const searchData = async (pagination: PaginationState, valueSearch: string): Promise<any> => {
    try {
        const response = await ProxyAPI.view(pagination, valueSearch);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

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

const ProxyTable = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationState>(InitialPaginationState);
    const [data, setData] = useState<any[]>([]);
    const [pageCount, setPageCount] = useState<number>(1);
    const [valueSearch, setValueSearch] = useState<string>("")
    const debouncedSearchTerm = useDebounce(valueSearch, 800);

    const router = useRouter();

    const handlePaginationChange = (pagination: PaginationState) => {
        setLoading(true);
        setPagination(pagination);
    };

    const handleBtnCreateProxy = () => {
        router.push("/dashboards/proxy/new");
    };

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
    };

    const search = async () => {
        setLoading(true);
        try {
            const newData = await searchData(pagination, valueSearch);
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
        fetchData();
    }, [pagination]);

    const onDeleteItem = useCallback((id: string) => deleteProxy(id, fetchData), [pagination]);

    const columns = useMemo(() => getProxyColumns({ onDeleteItem }), [onDeleteItem]);

    return (
        <div>
            <div>
                <div>
                    <h1 className='font-normal text-xl md:text-xl mb-3 flex items-center mt-8'>
                        <span>Proxy</span>
                    </h1>
                </div>
                <div className="flex">
                    <div className='relative h-9 w-full md:w-1/3 md:flex-shrink-0 mb-6'>
                        <MagnifyingGlassIcon className='inline-block absolute ml-2 mt-1 text-gray-400' width={20} height={24} />
                        <Input
                            data-testid="search-input"
                            className="appearance-none bg-white dark:bg-gray-800 shadow rounded-full h-8 w-full pl-10 focus:bg-white focus:outline-none focus:ring ring-primary-200 dark:ring-gray-600"
                            placeholder="Search"
                            type="search"
                            spellCheck="false"
                            aria-label="Search"
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="w-full flex items-center mb-6">
                        <div className="flex-shrink-0 ml-auto">
                            <Button
                                className="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 font-bold"
                                style={{ backgroundColor: "rgb(14,165,233)" }}
                                onClick={handleBtnCreateProxy}
                            >
                                Create Proxy
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? (
                <Skeleton className="w-[100%] h-[50px] rounded-lg mt-10" />
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    pageCount={pageCount}
                    pagination={pagination}
                    onSetPagination={handlePaginationChange}
                />
            )}
        </div>
    );
};

export default ProxyTable;
