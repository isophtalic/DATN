'use client'
import React, { useState, useEffect } from 'react'
import { EyeIcon, EyeSlashIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
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
import { useParams, useRouter } from 'next/navigation'
import ProxyAPI from '@/apis/proxy'
import AccesslistAPI from '@/apis/accesslist'
import { toast } from '@/components/ui/use-toast'
import UserAPI from '@/apis/users'

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const formSchema = z.object({
    username: z.string().min(4).max(50),
    email: z.string().email("Email not valid"),
    password: z.string().min(8, {
        message: "Password needs a minimum of 8 characters"
    }),
    confirm_password: z.string().min(8, {
        message: "Password needs a minimum of 8 characters"
    })
}).superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
        ctx.addIssue({
            code: "custom",
            message: "The confirm passwords did not match"
        });
    }
})

interface ItemRow {
    key: any,
    field: "username" | "email" | "password" | "confirm_password",
    value?: any
}

interface DataPage {
    title: string;
    rows: ItemRow[];
}

const NewAccesslist = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [isShow, setIsShow] = useState<boolean>(true)
    const [isShowCF, setIsShowCF] = useState<boolean>(true)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirm_password: "",
        },
    })

    const { formState: { errors } } = form

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            let res = await UserAPI.newItem({
                username: values.username,
                password: values.password,
                email: values.email
            })
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

    const datapage: DataPage[] = [
        {
            title: `Create User`,
            rows: [
                {
                    key: "Email",
                    field: "email",
                },
                {
                    key: "Username",
                    field: "username",
                },
                {
                    key: "Password",
                    field: "password",
                },
                {
                    key: "Confirm_password",
                    field: "confirm_password",
                },
            ]
        }
    ]

    return (
        <div className='m-10'>
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
                            <BreadcrumbLink href={"/dashboards/users/new"}>Create User</BreadcrumbLink>
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
                                                                            {element.field == 'password' || element.field == 'confirm_password' ? (
                                                                                element.field === 'password' ? (
                                                                                    <div className='grid grid-cols-8 gap-4'>
                                                                                        <Input
                                                                                            placeholder={`Input ${element.field}`}
                                                                                            {...field}
                                                                                            type={isShow ? "text" : "password"}
                                                                                            value={field.value !== undefined ? String(field.value) : ''}
                                                                                            className='col-span-7'
                                                                                        />
                                                                                        <div className='grid justify-items-center '>
                                                                                            {isShow ? (
                                                                                                <EyeSlashIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShow(prev => !prev)} />
                                                                                            ) : (
                                                                                                <EyeIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShow(prev => !prev)} />
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className='grid grid-cols-8 gap-4'>
                                                                                        <Input
                                                                                            placeholder={`Input ${element.field}`}
                                                                                            {...field}
                                                                                            type={isShowCF ? "text" : "password"}
                                                                                            value={field.value !== undefined ? String(field.value) : ''}
                                                                                            className='col-span-7'
                                                                                        />
                                                                                        <div className='grid justify-items-center '>
                                                                                            {isShowCF ? (
                                                                                                <EyeSlashIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShowCF(prev => !prev)} />
                                                                                            ) : (
                                                                                                <EyeIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShowCF(prev => !prev)} />
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            ) : (

                                                                                <Input
                                                                                    placeholder={`Input ${element.field}`}
                                                                                    {...field}
                                                                                    type={"text"}
                                                                                    value={field.value !== undefined ? String(field.value) : ''}
                                                                                />
                                                                            )}
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
                                    <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(14,165,233)" }} type="submit">Create User</Button>
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

export default NewAccesslist