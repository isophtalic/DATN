"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/router"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ActionsCell from "./actions_cell"

type ProxyColumnsProps = {
    onDeleteItem: (id: string) => void
}

export const getProxyColumns = ({ onDeleteItem }: ProxyColumnsProps): ColumnDef<ProxyViewer>[] => [
    {
        cell: ({ row }) => {
            return (
                <span key={row.original.proxy_id}>
                    {row.index + 1}
                </span>
            )
        },
        header: "No."
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    className="w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "hostname",
        header: "HOSTNAME",
    },
    {
        accessorKey: "port",
        header: "PORT",
    },
    {
        accessorKey: "scheme",
        header: "FORWARD SCHEME",
    },
    {
        accessorKey: "ip",
        header: "FORWARD HOSTNAME/IP",
    },
    {
        accessorKey: "forward_port",
        header: "FORWARD PORT",
    },
    {
        accessorKey: "rule",
        header: "RULE SET",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original
            return (
                <ActionsCell proxy={payment} onDeleteItem={onDeleteItem} />
            )
        },
    },
]
