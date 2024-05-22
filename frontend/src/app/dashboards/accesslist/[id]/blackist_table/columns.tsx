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
import ActionsCell from "./actions_cell"

type ColumnProps = {
    id: string,
    onDelete: (id: string) => void
}

export const getColumns = ({ id, onDelete }: ColumnProps): ColumnDef<BlacklistInterface>[] => [
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
            return (
                <ActionsCell blacklist={payment} id={id} onDelete={onDelete} />
            )
        },
    }
]
