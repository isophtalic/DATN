'use client'
import React, { useState, useEffect } from 'react'
import { PencilSquareIcon, TrashIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Skeleton } from "@/components/ui/skeleton"

// import { useRouter } from 'next/router'
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
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from 'next/navigation'
import BlacklistAPI from '@/apis/blacklist'

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const formSchema = z.object({
    id: z.string(),
    ip: z.string().regex(ipv4Regex, {
        message: "Invalid IPv4 address format"
    }),
    status: z.number(),
    accesslist_id: z.string(),
})

interface ItemRow {
    key: any,
    field: "id" | "ip" | "status" | "accesslist_id",
    value: any
}

interface DataPage {
    title: string;
    icon?: JSX.Element;
    rows: ItemRow[];
}

const NewBlacklist = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<BlacklistInterface>({
        id: "",
        accesslist_id: "",
        ip: "",
        status: 0
    });

    const router = useRouter();
    const params = useParams();

    let accesslist_id = params.id;
    if (Array.isArray(accesslist_id)) {
        accesslist_id = accesslist_id[0];
    }

    const datapage: DataPage[] = [
        {
            title: `Create Blacklist`,
            rows: [
                {
                    key: "IP",
                    field: "ip",
                    value: `${data.ip}`
                },
                {
                    key: "Status",
                    field: "status",
                    value: `${data.status}`
                },
            ]
        }
    ]

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data.id,
            ip: data.ip,
            status: data.status,
            accesslist_id: data.accesslist_id,
        },
    })

    useEffect(() => {
        console.log(data);
    }, [data])

    const { formState: { errors } } = form

    async function onSubmit(values: z.infer<typeof formSchema>) {
        values.accesslist_id = accesslist_id as string;
        console.log(values);

        try {
            let res = await BlacklistAPI.newItem(values)
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
                            <BreadcrumbLink className='font-bold pointer-events-none' style={{ color: "rgb(14,165,233)" }} href="/dashboards/proxy">Blackist</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={"/dashboards/blackist/new"}>Create Blacklist</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div>
                <div className='relative mt-8'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {datapage.map((e, i) => (
                                <div className="mb-8" key={i}>
                                    <div className="md:flex items-center mb-3">
                                        <div className='flex flex-auto truncate items-center'>
                                            <h1 className='font-normal text-xl md:text-xl'>{e.title}</h1>
                                        </div>
                                        {e.icon}
                                    </div>
                                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow mt-3 py-2 px-6 divide-y divide-gray-100 dark:divide-gray-700'>
                                        {e.rows.map((element, index) => (
                                            <div className='flex flex-col md:flex-row px-6 py-2 md:py-0 space-y-2 md:space-y-0' key={index}>
                                                <FormField
                                                    control={form.control}
                                                    name={element.field}
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col md:flex-row md:py-0 space-y-2 md:space-y-0 w-full'>
                                                            <FormLabel className='flex-1 flex items-center'>
                                                                <h4 className="font-light text-lg">{element.key}</h4>
                                                            </FormLabel>
                                                            <div className='md:w-3/4 md:py-3 break-all lg:break-words'>
                                                                {element.field === "status" ? (
                                                                    <div>
                                                                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select status" />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                <SelectItem key={0} value={"0"}>allow</SelectItem>
                                                                                <SelectItem key={1} value={"1"}>deny</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage>
                                                                            {errors[element.field] && (
                                                                                <span className="text-red-500">{errors[element.field]?.message}</span>
                                                                            )}
                                                                        </FormMessage>
                                                                    </div>

                                                                ) : (
                                                                    <div>
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder={`Input ${element.field}`}
                                                                                {...field}
                                                                                type={"text"}
                                                                                value={field.value !== undefined ? String(field.value) : ''}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage>
                                                                            {errors[element.field] && (
                                                                                <span className="text-red-500">{errors[element.field]?.message}</span>
                                                                            )}
                                                                        </FormMessage>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className='flex flex-row-reverse gap-10'>
                                <div>
                                    <Button className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300 mr-10' style={{ backgroundColor: "rgb(14,165,233)" }} type="submit">Create</Button>
                                </div>
                                <div>
                                    <Button className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(241, 245, 249)", color: "#595959" }} onClick={() => router.back()} type="button">Close</Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default NewBlacklist;
