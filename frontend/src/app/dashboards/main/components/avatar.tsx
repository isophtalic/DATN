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

const ShadcnAvatar = () => {

    const onLogOut = () => {
        Cookies.remove(AUTHEN_TOKEN_KEY)
    }

    return (
        <Popover >
            <PopoverTrigger className='grid grid-cols-2 gap-1'>
                <div className='grid justify-items-center'>
                    <Avatar >
                        <AvatarFallback />
                        <AvatarImage src="https://avatars.githubusercontent.com/u/10513364?v=4" />
                    </Avatar>
                </div>
                <div className='flex flex-row items-center'>
                    Admin
                    <ChevronDownIcon className='w-[20px] h-[20px]' />
                </div>

            </PopoverTrigger>
            <PopoverContent>
                <span>admin@cyradar.com</span>
                <ul >
                    <li>
                        <Link href="/auth/login" onClick={onLogOut}>Log out</Link>
                    </li>
                </ul>
            </PopoverContent>
        </Popover>
    )
}

export default ShadcnAvatar