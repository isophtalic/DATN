import React from 'react'
import Link from "next/link"

interface DetailPageProps {
    data: SecLog
    seclog_id: string
}

import { MinusIcon } from '@heroicons/react/24/outline';
import { DateTime } from '@/lib/datetime';
import JsonViewer from './jsonViewer';


const DetailPage = ({ data, seclog_id }: DetailPageProps) => {
    console.log(data);
    const accesslist = [
        {
            title: `Secure Logs`,
            rows: [
                {
                    key: "Client IP",
                    value: data.client_ip
                },
                {
                    key: "Host",
                    value: data.host
                },
                {
                    key: "Method",
                    value: data.method
                },
                {
                    key: "Proto",
                    value: data.proto
                },
                {
                    key: "URI",
                    value: data.uri
                },

                {
                    key: "Mess",
                    value: data.mess
                },
                {
                    key: "Headers",
                    value: data.headers
                },
                {
                    key: "Body",
                    value: data.body
                },
                {
                    key: "Form-data",
                    value: data.form
                },
                {
                    key: "Securiy Log",
                    value: data.secure_logs
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
                                            {element.key === "Headers" || element.key === "Body" || element.key === "Form-data" || element.key === "Securiy Log" ? (
                                                element.value && <JsonViewer data={JSON.parse(element.value)} />
                                                // <span>{element.value}</span>
                                            ) : (
                                                // element.key === "Original" ? (
                                                //     <MinusIcon className='w-10' />
                                                // ) : (
                                                //     <span className='text-gray-600'>
                                                //         {element.value}
                                                //     </span>
                                                // )
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

        </div>
    )

}

export default DetailPage