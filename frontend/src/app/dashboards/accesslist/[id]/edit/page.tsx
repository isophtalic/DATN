'use client'
import React, { useState, useEffect } from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Skeleton } from "@/components/ui/skeleton"

import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"


import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRightIcon } from '@heroicons/react/24/outline'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from 'next/navigation'
import AccesslistAPI from '@/apis/accesslist'
// TODO: fix edit page accesslist
const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const formSchema = z.object({
    name: z.string(),
})

interface ItemRow {
    key: any,
    field: "name",
    value: any
}

interface DataPage {
    title: string;
    icon?: JSX.Element;
    rows: ItemRow[];
}

const getData = async (id: string) => {
    try {
        const response = await AccesslistAPI.detail(id)
        console.log("🚀 ~ getData ~ response:", response)
        return response.data
    } catch (error) {
        console.log(error)
        return undefined
    }
}

const getPageData = (data: AccesslistInterface): DataPage[] => {
    return [
        {
            title: `Accesslist Update: ${data.name}`,
            icon: <div className='ml-auto flex items-center'>
                <div className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }}>
                    <TrashIcon className="w-7 h-7 " />
                </div>
                <div className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }}>
                    <PencilSquareIcon className="w-7 h-7" />
                </div>
            </div>,
            rows: [
                {
                    key: "name",
                    field: "name",
                    value: `${data.name}`
                },
            ]
        },
    ]
}

// interface Rows extends Array<ItemRow> { }

const ProxyEditor = () => {
    const param = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<AccesslistInterface>({
        accesslist_id: "",
        name: "",
        updated_at: ""
    });

    let idAccesslist = param.id
    if (Array.isArray(idAccesslist)) {
        idAccesslist = idAccesslist[0]
    }

    // ghep api them, sua, xoa

    const datapage: DataPage[] = [
        {
            title: `Accesslist Detail: ${data.name}`,
            icon: <div className='ml-auto flex items-center'>
                <div className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }}>
                    <TrashIcon className="w-7 h-7 " />
                </div>
                <div className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }}>
                    <PencilSquareIcon className="w-7 h-7" />
                </div>
            </div>,
            rows: [
                {
                    key: "Name",
                    field: "name",
                    value: `${data.name}`
                },
            ],
        }
    ]


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data.name,
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true before fetching data
            try {
                let dataSever = await getData(idAccesslist);
                if (dataSever) {
                    setData(dataSever);
                    form.reset({
                        name: dataSever.name,
                    }); // Update data with the fetched data
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to fetch data",
                    // description: error,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [idAccesslist])

    useEffect(() => {
        console.log(data);
    }, [data])

    const { formState: { errors } } = form

    async function onSubmit(values: z.infer<typeof formSchema>) {
        var itemUpdated: AccesslistInterface = {
            accesslist_id: idAccesslist as string,
            name: values.name,
            updated_at: undefined,
        }
        try {
            let res = await AccesslistAPI.updateItem(idAccesslist as string, itemUpdated)
            if (res.success) {
                toast({
                    description: "Updated",
                })
                router.back()
                return
            }

            throw res.message
        } catch (error) {

        }
    }


    return (
        <div>
            <div className=''>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-bold' style={{ color: "rgb(14,165,233)" }} href="/dashboards/accesslist">accesslist</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/dashboards/accesslist/" + idAccesslist}>Accesslist Detail</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/dashboards/accesslist/" + idAccesslist + '/edit'}>Update Accesslist: {data.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
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
                <div>
                    <div className='relative mt-8'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                {datapage.map((e, i) => {
                                    return (
                                        <div className="mb-8" key={i}>
                                            <div className="md:flex items-center mb-3">
                                                <div className='flex flex-auto truncate items-center'>
                                                    <h1 className='font-normal text-xl md:text-xl'>{e.title}</h1>
                                                </div>
                                            </div>
                                            <div className='bg-white dark:bg-gray-800 rounded-lg shadow mt-3 py-2 px-6 divide-y divide-gray-100 dark:divide-gray-700'>
                                                {e.rows.map((element, index) => {
                                                    return (
                                                        <div className='flex flex-col md:flex-row  px-6 py-2 md:py-0 space-y-2 md:space-y-0' key={index}>
                                                            <FormField
                                                                control={form.control}
                                                                name={element.field}
                                                                render={({ field }) => (
                                                                    <FormItem className='flex flex-col md:flex-row md:py-0 space-y-2 md:space-y-0 w-full'>
                                                                        <FormLabel className='flex-1 flex items-center'>
                                                                            <h4 className="font-light text-lg">{element.key}</h4>
                                                                        </FormLabel>
                                                                        <div className='md:w-3/4 md:py-3 break-all lg:break-words'>
                                                                            <FormControl>
                                                                                <Input
                                                                                    placeholder={`Input ${element.field}`}
                                                                                    {...field}
                                                                                    type={"text"}
                                                                                    value={field.value !== undefined ? String(field.value) : ''}

                                                                                />
                                                                            </FormControl>
                                                                        </div>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    )

                                                })}
                                            </div>
                                        </div>
                                    )

                                })}
                                <div className='flex flex-row-reverse gap-10'>
                                    <div >
                                        <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(14,165,233)" }} type="submit">Update Accesslist</Button>
                                    </div>
                                    <div>
                                        <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(241, 245, 249)", color: "#595959" }} type="button">Close</Button>
                                    </div>
                                </div>
                            </form>
                        </Form>

                    </div>
                </div>
            )}
        </div>

    )
}

export default ProxyEditor