'use client'
import React, { useState, useEffect } from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Checkbox } from "@/components/ui/checkbox"


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
import { useParams } from 'next/navigation'

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const formSchema = z.object({
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match"
        });
    }
})

interface ItemRow {
    key: any,
    field: "password" | "confirmPassword",
    value?: any
}

interface DataPage {
    title: string;
    rows: ItemRow[];
}

const NewProxy = () => {
    const param = useParams()
    const [loading, setLoading] = useState<boolean>(true);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const { formState: { errors } } = form

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    let userid = param.id as string

    const datapage: DataPage[] = [
        {
            title: `Change Password`,
            rows: [
                {
                    key: "Password",
                    field: "password",
                },
                {
                    key: "Confirm password",
                    field: "confirmPassword",
                },
            ]
        },
    ]

    return (
        <div className='p-10'>
            <div className=''>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-bold' style={{ color: "rgb(14,165,233)" }} href="/dashboards/users">Users</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/dashboards/users/${userid}/reset-pass`}>Reset Password</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div>
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
                                                                            <Input
                                                                                placeholder={`. . .`}
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
                                    <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(241, 245, 249)", color: "#595959" }} type="button">Close</Button>
                                </div>

                            </div>
                        </form>
                    </Form>

                </div>
            </div>

        </div>

    )
}

export default NewProxy