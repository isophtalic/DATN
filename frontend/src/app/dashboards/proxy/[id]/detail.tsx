'use client'
import React from 'react'
import Link from "next/link"

interface DetailPageProps {
    data: ProxyViewerDetail
    proxy_id: string
}

import { useRouter } from 'next/navigation'

import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import ProxyAPI from '@/apis/proxy'
import { toast } from '@/components/ui/use-toast'

const deleteProxy = async (id: string, router: AppRouterInstance) => {
    try {
        const res = await ProxyAPI.deleteByID(id)
        if (res.success) {
            toast({
                description: "Delete Successfully"
            })
            router.back()
        } else {
            throw new Error(res.message)
        }
    } catch (err) {
        toast({
            variant: "destructive",
            description: `${err}`
        })
    }
}

const DetailPage = ({ data, proxy_id }: DetailPageProps) => {
    console.log(data);

    const router = useRouter()

    // // const handleEditProxy = (id: string) => {
    // //     router.push(`/dashboards/proxy/${id}/edit`)
    // //     return
    // // }

    const datapage = [
        {
            title: `Proxy Detail: ${data.source.hostname}`,
            icon: <div className='ml-auto flex items-center'>
                <div className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }} onClick={() => deleteProxy(proxy_id, router)}>
                    {/* TODO: delete proxy*/}
                    <TrashIcon className="w-7 h-7 " />
                </div>
                {/* <div > */}
                <Link href={`/dashboards/proxy/${proxy_id}/edit`} className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }}>
                    <PencilSquareIcon className="w-7 h-7" />
                </Link>
                {/* </div> */}
            </div>,
            rows: [
                {
                    key: "Status",
                    value: data.status
                },
                {
                    key: "Cache",
                    value: data.cache
                },
            ]
        },
        {
            title: `Source`,
            rows: [
                {
                    key: "Hostname",
                    value: `${data.source.hostname}`
                },
                {
                    key: "Port",
                    value: `${data.source.port}`
                },
            ]
        },
        {
            title: `Destination`,
            rows: [
                {
                    key: "Forward Scheme",
                    value: `${data.destination.scheme}`
                },
                {
                    key: "Forward Hostname / IP",
                    value: `${data.destination.ip}`
                },
                {
                    key: "Forward Port",
                    value: `${data.destination.forward_port}`
                },
            ]
        },
        {
            title: "Security",
            rows: [
                {
                    key: "Rule Set",
                    value: `${data.secrule.name}`
                },
                {
                    key: "Debug Log Level",
                    value: `${data.secrule.debug_log_level}`
                },
            ]
        },
        {
            title: "Access",
            rows: [
                {
                    key: "Access List",
                    value: `${data.accesslist.name}`
                }
            ]
        }
    ]

    return (
        <div className='relative mt-8'>
            {datapage.map((e, i) => {
                {/* source */ }
                return (
                    <div className="mb-8" key={i}>
                        <div className="md:flex items-center mb-3">
                            <div className='flex flex-auto truncate items-center'>
                                <h1 className='font-normal text-xl md:text-xl'>{e.title}</h1>
                            </div>
                            {e.icon}
                        </div>
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow mt-3 py-2 px-6 divide-y divide-gray-100 dark:divide-gray-700'>
                            {e.rows.map((element, index) => {
                                console.log(element.key)
                                return (
                                    <div className='flex flex-col md:flex-row -mx-6 px-6 py-2 md:py-0 space-y-2 md:space-y-0' key={index}>
                                        <div className='md:w-1/4 md:py-3'>
                                            <h4 className="font-normal text-gray-700">{element.key}</h4>
                                        </div>
                                        <div className='md:w-3/4 md:py-3 break-all lg:break-words'>
                                            {element.key === "Status" || element.key === "Cache" ? (
                                                (element.value) ? (
                                                    <CheckCircleIcon className='w-6 h6 text-green-600' />
                                                ) : (
                                                    <XCircleIcon className='w-6 h6 text-rose-600' />
                                                )
                                            ) : (
                                                <span className='text-gray-700'>
                                                    {element.value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                    </div>
                )

            })}
        </div>
    )

}

export default DetailPage