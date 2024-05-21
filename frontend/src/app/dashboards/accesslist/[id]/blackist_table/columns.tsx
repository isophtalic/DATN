"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { BlacklistStatus } from "@/store/constants/const"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { useRouter } from "next/navigation"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const columns: ColumnDef<BlacklistInterface>[] = [
    {
        cell: ({ row }) => {
            return (
                <span key={row.original.accesslist_id}>
                    {row.index + 1}
                </span>
            )
        },
        header: "No."
    },
    {
        accessorKey: "ip",
        header: "IP / Subnet",
    },
    {
        accessorKey: "status",
        cell: (cell) => {
            const value = cell.getValue()

            if (value === '')
                return null;

            if (value === BlacklistStatus.ALLOW) {
                return "allow"
            }

            return "deny"
        },
        header: "Status",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original
            var router = useRouter()
            return (
                <div className="flex flex-row justify-end">
                    <div className="w-10 h-10 flex justify-center cursor-pointer rounded-lg hover:bg-sky-500 hover:text-white shadow border hover:border-sky-500">
                        <TrashIcon className='w-6 h6' />
                    </div>
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
                                <DropdownMenuItem>
                                    {payment.status === 0 ? "Deny" : "Allow"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )
        },
    }
]
