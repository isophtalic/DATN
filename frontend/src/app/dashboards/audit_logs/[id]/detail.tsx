import React from 'react'
import Link from "next/link"

interface DetailPageProps {
    data: ActionsInterface
    action_id: string
}

import { MinusIcon } from '@heroicons/react/24/outline';
import { DateTime } from '@/lib/datetime';
import JsonViewer from './jsonViewer';


const DetailPage = ({ data, action_id }: DetailPageProps) => {
    console.log(data);
    const accesslist = [
        {
            title: `Audit Logs: ${data.name}`,
            rows: [
                {
                    key: "Name",
                    value: data.name
                },
                {
                    key: "Target",
                    value: data.target
                },
                {
                    key: "Target ID",
                    value: data.target_id
                },
                {
                    key: "Original",
                    value: data.original
                },
                {
                    key: "Changes",
                    value: data.changes
                },
                {
                    key: "Happened At",
                    value: DateTime.DateTimeFormat(data.created_at)
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
                        </div>
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow mt-3 py-2 px-6 divide-y divide-gray-100 dark:divide-gray-700'>
                            {e.rows.map((element, index) => {
                                console.log(element.value)
                                return (
                                    <div className='flex flex-col md:flex-row -mx-6 px-6 py-2 md:py-0 space-y-2 md:space-y-0' key={index}>
                                        <div className='md:w-1/4 md:py-3'>
                                            <h4 className="font-normal text-gray-700">{element.key}</h4>
                                        </div>
                                        <div className='md:w-3/4 md:py-3 break-all lg:break-words'>
                                            {element.key === "Changes" ? (
                                                data.name === "delete" ? (
                                                    <MinusIcon className='w-10' />
                                                ) : (
                                                    element.value && <JsonViewer data={JSON.parse(element.value)} />
                                                )
                                                // <span>{element.value}</span>
                                            ) : (
                                                element.key === "Original" && data.name !== "update" ? (
                                                    <MinusIcon className='w-10' />
                                                ) : (
                                                    element.key === "Original" && data.name === "update" ? (
                                                        element.value && <JsonViewer data={JSON.parse(element.value)} />

                                                    ) : (
                                                        <span className='text-gray-600'>
                                                            {element.value}
                                                        </span>
                                                    )
                                                )
                                                // <span className='text-gray-600'>
                                                /* {element.value} */
                                                /* </span> */
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