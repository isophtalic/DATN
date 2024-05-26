'use client'
import React, { useEffect, useState } from 'react'

interface DetailPageProps {
    data: DataRuleInterface
    dataid: string
}
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'


import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { DateTime } from '@/lib/datetime';
import DataRuleAPI from '@/apis/datarule'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const updateRule = (id: string, ruleUpdated: DataRuleInterface) => {
    DataRuleAPI.updateItem(id, ruleUpdated).then(res => {
        if (res.success) {
            toast({
                description: "Updated",
            })
            return
        }

        toast({
            variant: "destructive",
            title: "Somethinmg went wrong",
            description: `${res.message}`
        })
    }).catch(error => {
        toast({
            variant: "destructive",
            title: "Somethinmg went wrong",
            description: `${error}`
        })
    })
}

async function deleteItem(id: string, router: AppRouterInstance) {
    try {
        const res = await DataRuleAPI.deleteByID(id);
        if (res.success) {
            toast({
                description: "Delete Successfully",
            });
            router.back(); // Refresh data after successful deletion
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

const DetailPage = ({ data, dataid }: DetailPageProps) => {
    console.log("🚀 ~ DetailPage ~ data:", data)
    const [isEdit, setEdit] = useState<boolean>(false)
    const defaultContent = data.content
    const [content, setContent] = useState<string>(defaultContent)
    const [contentTMP, setContentTMP] = useState<string>(defaultContent)

    const defaultDescription = data.description
    const [description, setDescription] = useState<string>(defaultDescription)
    const [descriptionTMP, setDescriptionTMP] = useState<string>(defaultDescription)

    const defaultName = data.name
    const [name, setName] = useState<string>(defaultName)
    const [nameTMP, setNameTMP] = useState<string>(defaultName)

    const router = useRouter()

    const handleEdit = () => {
        setEdit(true)
    }

    const handleBtnEdited = () => {
        setContent(contentTMP)
        setName(nameTMP)
        setDescription(descriptionTMP)
        let ruleUpdated = {
            ...data,
            name: nameTMP.trim() ? nameTMP : defaultName,
            content: contentTMP.trim() ? contentTMP : defaultContent,
            description: descriptionTMP.trim() ? descriptionTMP : defaultName,
        }
        console.log("🚀 ~ handleBtnEdited ~ ruleUpdated:", ruleUpdated)
        // TODO: add API update
        updateRule(dataid, ruleUpdated)
        setEdit(false)
    }

    const editContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContentTMP(e.target.value)
    }

    const editDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescriptionTMP(e.target.value)
    }

    const editName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNameTMP(e.target.value)
    }

    useEffect(() => {
        console.log("🚀 ~ useEffect ~ content:", content)
    }, [isEdit, content])

    const rules = [
        {
            title: `Detail Data: ${data.name}`,
            icon: <div className='ml-auto flex items-center'>
                <div className='p-4 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }} onClick={() => deleteItem(dataid, router)}>
                    {/* TODO: delete rule*/}
                    <TrashIcon className="w-7 h-7 " />
                </div>
                {/* <div > */}
                <div className='p-4 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }} onClick={handleEdit} >
                    <PencilSquareIcon className="w-7 h-7" />
                </div>
                {/* </div> */}
            </div>,
            rows: [
                {
                    key: "Name",
                    value: data.name
                },
                {
                    key: "Desc",
                    value: data.description
                },
                {
                    key: "Created At",
                    value: DateTime.DateTimeFormat(data.created_at)
                },
                {
                    key: "Updated At",
                    value: DateTime.DateTimeFormat(data.updated_at)
                },
                {
                    key: "Content",
                    value: data.content
                },
            ]
        },
    ]

    return (
        <div className='relative mt-8'>
            {rules.map((e, i) => {
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
                                return (
                                    <div className='flex flex-col md:flex-row -mx-6 px-6 py-2 md:py-0 space-y-2 md:space-y-0' key={index}>
                                        <div className='md:w-1/4 md:py-3'>
                                            <h4 className="font-normal text-gray-700">{element.key}</h4>
                                        </div>
                                        <div className='md:w-3/4 md:py-3 break-all lg:break-words'>
                                            {element.key === "Content" ? (
                                                isEdit ? (
                                                    <Textarea defaultValue={content === "" ? element.value : content} onChange={editContent} />
                                                ) : (
                                                    <span className='text-gray-600'>
                                                        {content === "" ? element.value : content}
                                                    </span>
                                                )
                                            ) : (
                                                element.key === "Desc" ? (
                                                    isEdit ? (
                                                        <Textarea defaultValue={description === "" ? element.value : description} onChange={editDescription} />
                                                    ) : (
                                                        <span className='text-gray-600'>
                                                            {description === "" ? element.value : description}
                                                        </span>
                                                    )
                                                ) : (
                                                    element.key === "Name" ? (
                                                        isEdit ? (
                                                            <Textarea defaultValue={name === "" ? element.value : name} onChange={editName} />
                                                        ) : (
                                                            <span className='text-gray-600'>
                                                                {name === "" ? element.value : name}
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className='text-gray-600'>
                                                            {element.value}
                                                        </span>
                                                    )
                                                )

                                            )}
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                    </div>
                )
            })}

            {isEdit ? (
                <Button className="flex-shrink-0 shadow rounded focus:outline-none ring-primary-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300 font-bold" style={{ backgroundColor: "rgb(14,165,233)" }} onClick={handleBtnEdited}>Update</Button>
            ) : (
                <></>
            )}


        </div>
    )
}

export default DetailPage