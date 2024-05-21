'use client'
import React, { useState, useEffect } from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Checkbox } from "@/components/ui/checkbox"

import { Skeleton } from "@/components/ui/skeleton"
import AccesslistAPI from '@/apis/accesslist'
import SecRuleAPI from '@/apis/secruleset'

import { toast } from "@/components/ui/use-toast"

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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


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
import { useRouter } from 'next/navigation'
import ProxyAPI from '@/apis/proxy'
import { PaginationState } from '@tanstack/react-table'
import { seclogBaseURL } from '@/apis/config'
import { hostname } from 'os'

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const formSchema = z.object({
    status: z.boolean().default(false).optional(),
    cache: z.boolean().default(false).optional(),
    hostname: z.string(),
    port: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    scheme: z.union([z.literal("https"), z.literal("http"), z.literal("ftp")]),
    ip: z.string().regex(ipv4Regex, {
        message: "Invalid IPv4 address format"
    }),
    forward_port: z.string(),
    rule: z.string().min(1, {
        message: "please select rule"
    }),
    accesslist: z.string().min(1, {
        message: "please select accesslist"
    }),
})

interface ItemRow {
    key: any,
    field: "status" | "cache" | "hostname" | "port" | "scheme" | "ip" | "forward_port" | "rule" | "accesslist",
    value?: any
}

interface DataPage {
    title: string;
    rows: ItemRow[];
}

async function getAccesslist(): Promise<any> {
    let result: any[] = []
    var pagination: PaginationState = {
        pageIndex: 0,
        pageSize: 100,
    }
    try {
        const response = await AccesslistAPI.list(pagination)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

async function getSecRule(): Promise<any> {
    let result: any[] = []
    var pagination: PaginationState = {
        pageIndex: 0,
        pageSize: 100,
    }

    try {
        const response = await SecRuleAPI.view(pagination)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

const NewProxy = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [selectAccesslist, setSelectAccesslist] = useState<any[]>([])
    const [selectSecRule, setSelectSecRule] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            var dataAccesslist
            try {
                dataAccesslist = await getAccesslist()
                console.log("🚀 ~ fetchData ~ dataAccesslist:", dataAccesslist)
                setLoading(false);
            } catch (error) {
                console.log("🚀 ~ fetchData ~ error:", error)
                return
            }

            var dataSecRule
            try {
                dataSecRule = await getSecRule()
                console.log("🚀 ~ fetchData ~ dataSecRule:", dataSecRule)
                setLoading(false);
            } catch (error) {
                console.log("🚀 ~ fetchData ~ error:", error)
                return
            }

            if (dataAccesslist !== undefined)
                setSelectAccesslist(dataAccesslist.records);

            if (dataSecRule !== undefined)
                setSelectSecRule(dataSecRule.records);
        }
        fetchData()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: true,
            cache: true,
            hostname: "",
            port: "",
            scheme: "http",
            ip: "",
            forward_port: "",
            rule: "",
            accesslist: ""
        },
    })

    const { formState: { errors } } = form

    async function onSubmit(values: z.infer<typeof formSchema>) {
        var newProxy: ProxyCreator = {
            status: values.status,
            cache: values.cache,
            source: {
                hostname: values.hostname,
                port: values.port,
            },
            destination: {
                scheme: values.scheme,
                ip: values.ip,
                forward_port: values.forward_port,
            },
            accesslist_id: values.accesslist,
            secrule_id: values.rule,
        }
        try {
            let res = await ProxyAPI.newItem(newProxy)
            if (res.success) {
                toast({
                    description: "Created",
                })
                router.back()
                return
            }

            throw res.message
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Somethinmg went wrong",
            })
        }

    }

    const datapage: DataPage[] = [
        {
            title: `Create Proxy`,
            rows: [
                {
                    key: "Status",
                    field: "status",
                },
                {
                    key: "Cache",
                    field: "cache",
                },
            ]
        },
        {
            title: `Source`,
            rows: [
                {
                    field: "hostname",
                    key: "Hostname",
                },
                {
                    field: "port",
                    key: "Port",
                },
            ]
        },
        {
            title: `Destination`,
            rows: [
                {
                    field: "scheme",
                    key: "Forward Scheme",
                },
                {
                    field: "ip",
                    key: "Forward Hostname / IP",
                },
                {
                    field: "forward_port",
                    key: "Forward Port",
                },
            ]
        },
        {
            title: "Security",
            rows: [
                {
                    field: "rule",
                    key: "Rule Set",
                },
            ]
        },
        {
            title: "Access",
            rows: [
                {
                    field: "accesslist",
                    key: "Access List",
                }
            ]
        }
    ]

    return (
        <div className='m-10'>
            <div className=''>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-bold' style={{ color: "rgb(14,165,233)" }} href="/dashboards/proxy">Proxy</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/dashboards/proxy/new"}>Create Proxy</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>


            <div>
                {loading ? (
                    <div className="flex flex-col space-y-3 mt-20 ml-20">
                        <Skeleton className="h-[150px] w-[300px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ) : (
                    <div className='relative mt-8'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                {datapage.map((e, i) => {
                                    //    

                                    return (
                                        <div className="mb-8" key={i}>
                                            <div className="md:flex items-center mb-3">
                                                <div className='flex flex-auto truncate items-center'>
                                                    <h1 className='font-normal text-xl md:text-xl'>{e.title}</h1>
                                                </div>
                                            </div>
                                            <div className='bg-white dark:bg-gray-800 rounded-lg shadow mt-3 py-2 px-6 divide-y divide-gray-100 dark:divide-gray-700'>
                                                {e.rows.map((element, index) => {
                                                    console.log("🚀 ~ {e.rows.map ~ element:", element.value)
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
                                                                                {element.field === "status" || element.field === "cache" ? (
                                                                                    <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                                                                                ) : (

                                                                                    element.field === "accesslist" ? (
                                                                                        <Select
                                                                                            value={field.value}
                                                                                            onValueChange={(value) => { field.onChange(value) }}
                                                                                        >
                                                                                            <SelectTrigger className="w-[100%]">
                                                                                                <SelectValue placeholder="Select Accesslist" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent >
                                                                                                {selectAccesslist.map((item) => (
                                                                                                    <SelectItem value={item.accesslist_id} key={item.accesslist_id}>{item.name}</SelectItem>
                                                                                                ))}
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    ) : (
                                                                                        element.field === "rule" ? (
                                                                                            <Select
                                                                                                value={field.value}
                                                                                                onValueChange={(value) => field.onChange(value)}
                                                                                            >
                                                                                                <SelectTrigger className="w-[100%]">
                                                                                                    <SelectValue placeholder="Select SecRule" />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    {selectSecRule.map((item) => (
                                                                                                        <SelectItem value={item.secrule_id} key={item.secrule_id}>{item.name}</SelectItem>
                                                                                                    ))}
                                                                                                </SelectContent>
                                                                                            </Select>
                                                                                        ) : (
                                                                                            <Input
                                                                                                placeholder={`Input ${element.field}`}
                                                                                                {...field}
                                                                                                type={"text"}
                                                                                                value={field.value !== undefined ? String(field.value) : ''}
                                                                                            />
                                                                                        )
                                                                                    )
                                                                                )
                                                                                }
                                                                            </FormControl>

                                                                            <FormMessage>
                                                                                {errors[element.field] && (
                                                                                    <span className="text-red-500">{errors[element.field]?.message}</span>
                                                                                )}
                                                                            </FormMessage>
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
                                        <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(14,165,233)" }} type="submit">Create Proxy</Button>
                                    </div>
                                    <div>
                                        <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(241, 245, 249)", color: "#595959" }} type="button">Close</Button>
                                    </div>

                                </div>
                            </form>
                        </Form>

                    </div>
                )}

            </div>

        </div>

    )
}

export default NewProxy