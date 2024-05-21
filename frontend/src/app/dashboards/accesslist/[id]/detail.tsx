import React from 'react'
import Link from "next/link"

interface DetailPageProps {
    data: AccesslistInterface
    accesslist_id: string
}

import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { DateTime } from '@/lib/datetime';
import BlacklistTable from './blackist_table/blackist_table';
import ProxiesTable from './proxies_table/proxies_table';


const DetailPage = ({ data, accesslist_id }: DetailPageProps) => {
    console.log(data);
    const accesslist = [
        {
            title: `Access List Detail: ${data.name}`,
            icon: <div className='ml-auto flex items-center'>
                <div className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }}>
                    {/* TODO: delete proxy*/}
                    <TrashIcon className="w-7 h-7 " />
                </div>
                {/* <div > */}
                <Link href={`/dashboards/accesslist/${accesslist_id}/edit`} className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }}>
                    <PencilSquareIcon className="w-7 h-7" />
                </Link>
                {/* </div> */}
            </div>,
            rows: [
                {
                    key: "Name",
                    value: data.name
                },
                {
                    key: "Status",
                    value: true
                },
                {
                    key: "Updated At",
                    value: DateTime.DateTimeFormat(data.updated_at)
                },
            ]
        },
    ]

    return (
        <div className='relative mt-8'>
            {accesslist.map((e, i) => {
                {/* source */ }
                return (
                    <div className="mb-8" key={i}>
                        <div className="md:flex items-center mb-3">
                            <div className='flex flex-auto truncate items-center'>
                                <h1 className='font-normal text-xl md:text-xl text-gray-500'>{e.title}</h1>
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
                                                <span className='text-gray-600'>
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

            <div className="mb-8">
                <div>
                    <BlacklistTable />
                </div>
            </div>

            <div className="mb-8">
                <div>
                    <ProxiesTable />
                </div>
            </div>

        </div>
    )

}

export default DetailPage