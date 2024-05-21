'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import AuthAPI from "@/apis/auth"
import Cookie from 'js-cookie'

import { AUTHEN_TOKEN_KEY, OneDay } from "@/apis/constants/const"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { useRouter } from "next/navigation"
import useUserStore from "@/store/user";


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})
const LoginForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    const router = useRouter()

    const { formState: { errors } } = form

    const userStore = useUserStore()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            const response = await AuthAPI.authLogin(values);
            if (!response.success || response.data === undefined) {
                throw ('Something went wrong !');
            }
            toast({
                description: "Login sucessfully.",
            })

            userStore.login()
            Cookie.set(AUTHEN_TOKEN_KEY, response.data.token, {
                expires: OneDay
            })


            router.push("/dashboards/main")
        }
        catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login failed",
                description: error,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='p-5 flex flex-col gap-7'>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700">Username / Email</FormLabel>
                            <FormControl>
                                <Input placeholder="username . . ." {...field} type='text' className="border-none" />
                            </FormControl>
                            <FormMessage className='mt-10'>
                                {errors.username && (
                                    <span className="text-red-500">{errors.username.message}</span>
                                )}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700">Password</FormLabel>
                            <FormControl>
                                <Input placeholder="password . . ." {...field} type='password' className="border-none" />
                            </FormControl>
                            <FormMessage className='mt-10'>
                                {errors.password && (
                                    <span className="text-red-500">{errors.password.message}</span>
                                )}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <Button className='mt-15 shadow-lg' type="submit" >Submit</Button>
            </form>
        </Form>
    );
}

export default LoginForm