'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link'
import Cookies from 'js-cookie'
import { AUTHEN_TOKEN_KEY } from '@/apis/constants/const'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import useUserStore from '@/store/user'

const ShadcnAvatar = () => {

    const onLogOut = () => {
        Cookies.remove(AUTHEN_TOKEN_KEY)
    }

    const userStore = useUserStore()
    console.log("🚀 ~ ShadcnAvatar ~ userStore:", userStore)

    return (
        <Popover >
            <PopoverTrigger className='grid grid-cols-2 gap-1'>
                <div className='grid justify-items-center'>
                    <Avatar >
                        <AvatarFallback />
                        <AvatarImage src="https://w7.pngwing.com/pngs/605/466/png-transparent-shut-down-close-abandoned-icon-power-on-power-off-thumbnail.png" />
                    </Avatar>
                </div>
                <div className='flex flex-row items-center'>
                    {userStore.user.username}
                    <ChevronDownIcon className='w-[20px] h-[20px]' />
                </div>

            </PopoverTrigger>
            <PopoverContent className='p-0'>
                <div>
                    <Link href="/auth/login" onClick={onLogOut} className='w-full inline-block p-3 rounded-md border shadow font-bold' style={{ backgroundColor: "rgb(53, 162, 235)", color: "#fff" }}>Log out</Link>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ShadcnAvatar