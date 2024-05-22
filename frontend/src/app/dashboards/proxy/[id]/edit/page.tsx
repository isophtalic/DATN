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
import { useParams, useRouter } from 'next/navigation'
import ProxyAPI from '@/apis/proxy'
import { PaginationState } from '@tanstack/react-table'
import AccesslistAPI from '@/apis/accesslist'
import SecRuleAPI from '@/apis/secruleset'

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const formSchema = z.object({
    hostname: z.string(),
    port: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    scheme: z.union([z.literal("https"), z.literal("http"), z.literal("ftp")]),
    ip: z.string().regex(ipv4Regex, {
        message: "Invalid IPv4 address format"
    }),
    forward_port: z.string(),
    rule: z.string(),
    debug_log_level: z.number(),
    accesslist: z.string(),
})

interface ItemRow {
    key: any,
    field: "hostname" | "port" | "scheme" | "ip" | "forward_port" | "rule" | "debug_log_level" | "accesslist",
    value: any
}

interface DataPage {
    title: string;
    icon?: JSX.Element;
    rows: ItemRow[];
}

const fetchDataProxyDetail = async (id: string) => {
    try {
        const response = await ProxyAPI.detail(id)
        console.log("🚀 ~ fetchDataProxyDetail ~ response:", response)
        return response.data
    } catch (error) {
        console.log(error)
        return undefined
    }
}


// interface Rows extends Array<ItemRow> { }

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

const ProxyEditor = () => {
    const param = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [selectAccesslist, setSelectAccesslist] = useState<any[]>([])
    const [selectSecRule, setSelectSecRule] = useState<any[]>([])
    const [data, setData] = useState<ProxyViewerDetail>({
        proxy_id: "",
        status: true,
        cache: true,
        accesslist_id: "",
        secrule_id: "",
        created_at: "",
        updated_at: "",
        source: {
            source_id: "",
            proxy_id: "",
            created_at: "undefined",
            updated_at: "undefined",
            hostname: '',
            port: ''
        },
        destination: {
            destination_id: '',
            source_id: '',
            scheme: 'http',
            ip: '',
            forward_port: '',
            created_at: "undefined",
            updated_at: "undefined"
        },
        secrule: {
            secrule_id: '',
            created_at: "undefined",
            updated_at: "undefined",
            name: '',
            debug_log_level: 0
        },
        accesslist: {
            accesslist_id: '',
            name: '',
            updated_at: "undefined"
        }
    });

    const [pageState, setPageState] = useState<DataPage[]>([])

    const datapage: DataPage[] = [
        {
            title: `Proxy Update: ${data.source.hostname}`,
            icon: <div className='ml-auto flex items-center'>
                <div className='p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800' style={{ cursor: 'pointer' }}>
                    <PencilSquareIcon className="w-7 h-7" />
                </div>
            </div>,
            rows: [
                {
                    key: "Status",
                    field: "scheme",
                    value: `${data.status}`
                },
                {
                    key: "Cache",
                    field: "scheme",
                    value: `${data.cache}`
                },
            ]
        },
        {
            title: `Source`,
            rows: [
                {
                    field: "hostname",
                    key: "Hostname",
                    value: `${data.source.hostname}`
                },
                {
                    field: "port",
                    key: "Port",
                    value: `${data.source.port}`
                },
            ]
        },
        {
            title: `Destination`,
            rows: [
                {
                    field: "scheme",
                    key: "Forward Scheme",
                    value: `${data.destination.scheme}`
                },
                {
                    field: "ip",
                    key: "Forward Hostname / IP",
                    value: `${data.destination.ip}`
                },
                {
                    field: "forward_port",
                    key: "Forward Port",
                    value: `${data.destination.forward_port}`
                },
            ]
        },
        {
            title: "Security",
            rows: [
                {
                    field: "rule",
                    key: "Rule Set",
                    value: `${data.secrule.name}`
                },
                {
                    field: "debug_log_level",
                    key: "Debug Log Level",
                    value: `${data.secrule.debug_log_level}`
                },
            ]
        },
        {
            title: "Access",
            rows: [
                {
                    field: "accesslist",
                    key: "Access List",
                    value: `${data.accesslist.name}`
                }
            ]
        }
    ]

    let idProxy = param.id
    if (Array.isArray(idProxy)) {
        idProxy = idProxy[0]
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hostname: data.source.hostname,
            port: data.source.port,
            scheme: data.destination.scheme,
            ip: data.destination.ip,
            forward_port: data.destination.forward_port,
            rule: data.secrule.name,
            debug_log_level: data.secrule.debug_log_level,
            accesslist: data.accesslist.name
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true before fetching data
            try {
                let proxyDetail = await fetchDataProxyDetail(idProxy);
                if (proxyDetail) {
                    setData(proxyDetail);
                    form.reset({
                        hostname: proxyDetail.source.hostname,
                        port: proxyDetail.source.port,
                        scheme: proxyDetail.destination.scheme,
                        ip: proxyDetail.destination.ip,
                        forward_port: proxyDetail.destination.forward_port,
                        rule: proxyDetail.secrule.name,
                        debug_log_level: proxyDetail.secrule.debug_log_level,
                        accesslist: proxyDetail.accesslist.name
                    }); // Update data with the fetched data

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
                        setSelectAccesslist(dataAccesslist.records ?? []);

                    if (dataSecRule !== undefined)
                        setSelectSecRule(dataSecRule.records ?? []);
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
    }, [idProxy])

    useEffect(() => {
        console.log(data);
    }, [data])

    const { formState: { errors } } = form

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        var proxyUpdated: ProxyViewerDetail = {
            proxy_id: data.proxy_id,
            status: data.status,
            cache: data.cache,
            accesslist_id: values.accesslist,
            secrule_id: values.rule,
            created_at: data.created_at,
            updated_at: undefined,
            source: {
                hostname: values.hostname,
                source_id: data.source.source_id,
                proxy_id: data.proxy_id,
                created_at: data.source.created_at,
                updated_at: undefined,
                port: values.port
            },
            destination: {
                destination_id: data.destination.destination_id,
                source_id: data.source.source_id,
                scheme: values.scheme,
                ip: values.ip,
                forward_port: values.forward_port,
                created_at: data.destination.created_at,
                updated_at: undefined
            },
            secrule: data.secrule,
            accesslist: data.accesslist
        }
        try {
            let res = await ProxyAPI.updateItem(data.proxy_id, proxyUpdated)
            if (res.success) {
                toast({
                    description: "Updated",
                })
                return
            }

            throw res.message
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Somethinmg went wrong",
                description: `${error}`
            })
        }
    }


    return (
        <div>
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
                            <BreadcrumbLink href={"/dashboards/proxy/" + idProxy}>Proxy Detail</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/dashboards/proxy/" + idProxy + '/edit'}>Update Proxy: {data.source.hostname}</BreadcrumbLink>
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

                                    if (i === 0) {
                                        return
                                    }

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
                                                                                {/* <Input placeholder={`Input ${element.field}`} {...field} type='text' /> */}
                                                                                {/* <Input
                                                                                    placeholder={`Input ${element.field}`}
                                                                                    {...field}
                                                                                    type={element.field === 'debug_log_level' ? "number" : "text"}
                                                                                    value={field.value !== undefined ? String(field.value) : ''}
                                                                                    min={element.field === 'debug_log_level' ? 0 : undefined} // Set minimum value conditionally
                                                                                    max={element.field === 'debug_log_level' ? 7 : undefined}
                                                                                /> */}
                                                                                {element.field === 'debug_log_level' ? (
                                                                                    <Input
                                                                                        placeholder={`Input ${element.field}`}
                                                                                        {...field}
                                                                                        type={"number"}
                                                                                        value={field.value !== undefined ? String(field.value) : ''}
                                                                                        min={0} // Set minimum value conditionally
                                                                                        max={7}
                                                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                                    />
                                                                                ) : (
                                                                                    element.field === "accesslist" ? (
                                                                                        <Select
                                                                                            value={field.value as string || data.accesslist_id}
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
                                                                                                value={field.value as string || data.secrule_id}
                                                                                                onValueChange={(value) => field.onChange(value)}
                                                                                            >
                                                                                                <SelectTrigger className="w-[100%]">
                                                                                                    <SelectValue placeholder="Select SecRule" />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent defaultValue={data.secrule_id}>
                                                                                                    {selectSecRule.map((item) => (
                                                                                                        <SelectItem value={item.secrule_id} key={item.secrule_id} defaultChecked>{item.name}</SelectItem>
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
                                                                                        ))
                                                                                )}
                                                                            </FormControl>
                                                                            {/* <FormControl>
                                                                                {element.field === "status" || element.field === "cache" ? (
                                                                                    <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                                                                                ) : (
                                                                                    <Input
                                                                                        placeholder={`Input ${element.field}`}
                                                                                        {...field}
                                                                                        type={element.field === 'debug_log_level' ? "number" : "text"}
                                                                                        value={field.value !== undefined ? String(field.value) : ''}
                                                                                        min={element.field === 'debug_log_level' ? 0 : undefined} // Set minimum value conditionally
                                                                                        max={element.field === 'debug_log_level' ? 7 : undefined}
                                                                                    />
                                                                                )}
                                                                            </FormControl> */}
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
                                        <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(14,165,233)" }} type="submit">Update Proxy</Button>
                                    </div>
                                    <div>
                                        <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(241, 245, 249)", color: "#595959" }} type="button" onClick={() => { router.back() }}>Close</Button>
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