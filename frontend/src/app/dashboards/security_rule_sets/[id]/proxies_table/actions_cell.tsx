import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from 'next/navigation'

interface ActionsCellProps {
    proxy: ProxyViewer;
    onDeleteItem: (id: string) => void
}



const ActionsCell = ({ proxy, onDeleteItem }: ActionsCellProps) => {

    const router = useRouter()
    const viewDetail = (id: string) => {
        console.log("🚀 ~ viewDetail ~ e:", id)
        router.push(`/dashboards/proxy/${id}`)
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => viewDetail(proxy.proxy_id)}
                >
                    View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => onDeleteItem(proxy.proxy_id)}
                >Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ActionsCell