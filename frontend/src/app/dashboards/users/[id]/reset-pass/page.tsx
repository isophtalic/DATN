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
import { useParams,useRouter } from 'next/navigation'
import UserAPI from '@/apis/users'
import { toast } from '@/components/ui/use-toast'

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const formSchema = z.object({
    current_password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    new_password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
}).superRefine(({ confirmPassword, new_password }, ctx) => {
    if (confirmPassword !== new_password) {
        ctx.addIssue({
            code: "custom",
            message: "The confirm passwords did not match"
        });
    }
})

interface ItemRow {
    key: any,
    field: "new_password" | "confirmPassword" | "current_password",
    value?: any
}

interface DataPage {
    title: string;
    rows: ItemRow[];
}

const NewProxy = () => {
    const param = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [isShow1, setIsShow1] = useState<boolean>(false)
    const [isShow2, setIsShow2] = useState<boolean>(false)
    const [isShow3, setIsShow3] = useState<boolean>(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirmPassword: "",
        },
    })
    var idUser = param["id"]
    const { formState: { errors } } = form

    async function onSubmit(values: z.infer<typeof formSchema>) {
        var input: ChangePassword = {
            oldpass: values.current_password,
            newpass: values.new_password
        }
        try {
            let res = await UserAPI.changePassword(idUser as string, input)
            if (res.success) {
                toast({
                    description: "Successfully"
                })
                return
            }

            throw res.message
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something want wrong",
                description: `${error}`
            })
        }
    }

    let userid = param.id as string

    const datapage: DataPage[] = [
        {
            title: `Change Password`,
            rows: [
                {
                    key: "Password",
                    field: "current_password",
                },
                {
                    key: "New Password",
                    field: "new_password",
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
                                                                            {element.field === "current_password" ? (
                                                                                <div className='grid grid-cols-8 gap-4'>
                                                                                    <Input
                                                                                        placeholder={`. . .`}
                                                                                        {...field}
                                                                                        type={isShow1 ? "text" : "password"}
                                                                                        value={field.value !== undefined ? String(field.value) : ''}
                                                                                        className='col-span-7'
                                                                                    />
                                                                                    <div className='grid justify-items-center '>
                                                                                        {isShow1 ? (
                                                                                            <EyeSlashIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShow1(prev => !prev)} />
                                                                                        ) : (
                                                                                            <EyeIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShow1(prev => !prev)} />
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                element.field === "new_password" ? (
                                                                                    <div className='grid grid-cols-8 gap-4'>
                                                                                        <Input
                                                                                            placeholder={`. . .`}
                                                                                            {...field}
                                                                                            type={isShow2 ? "text" : "password"}
                                                                                            value={field.value !== undefined ? String(field.value) : ''}
                                                                                            className='col-span-7'
                                                                                        />
                                                                                        <div className='grid justify-items-center '>
                                                                                            {isShow2 ? (
                                                                                                <EyeSlashIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShow2(prev => !prev)} />
                                                                                            ) : (
                                                                                                <EyeIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShow2(prev => !prev)} />
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className='grid grid-cols-8 gap-4'>
                                                                                        <Input
                                                                                            placeholder={`. . .`}
                                                                                            {...field}
                                                                                            type={isShow3 ? "text" : "password"}
                                                                                            value={field.value !== undefined ? String(field.value) : ''}
                                                                                            className='col-span-7'
                                                                                        />
                                                                                        <div className='grid justify-items-center '>
                                                                                            {isShow3 ? (
                                                                                                <EyeSlashIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShow3(prev => !prev)} />
                                                                                            ) : (
                                                                                                <EyeIcon className='cursor-pointer w-10 h-10 col-span-1' onClick={() => setIsShow3(prev => !prev)} />
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                            {/* <Input
                                                                                placeholder={`. . .`}
                                                                                {...field}
                                                                                type={"text"}
                                                                                value={field.value !== undefined ? String(field.value) : ''}
                                                                            /> */}

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
                                    <Button className=' transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration:300' style={{ backgroundColor: "rgb(241, 245, 249)", color: "#595959" }} type="button" onClick={()=> {router.back()}}>Close</Button>
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