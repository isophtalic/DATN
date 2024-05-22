import React from 'react'
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"

const getUpdateItem = (blacklist: BlacklistInterface) => {
    return {
        ...blacklist,
        status: blacklist.status === 0 ? 1 : 0,
    }
}

interface ActionsCellProps {
    blacklist: BlacklistInterface
    id: string;
    onDelete: (id: string) => void
    onUpdate: (id: string, input: BlacklistInterface) => void
}
const ActionsCell = ({ id, blacklist, onDelete, onUpdate }: ActionsCellProps) => {
    return (
        <div className="flex flex-row justify-end">
            <div className="w-5"></div>
            <div className="">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border  hover:border-sky-500">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onUpdate(blacklist.id, getUpdateItem(blacklist))} className='cursor-pointer'>
                            {blacklist.status === 0 ? "Deny" : "Allow"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default ActionsCell