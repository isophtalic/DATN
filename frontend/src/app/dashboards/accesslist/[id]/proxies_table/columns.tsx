"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<ProxyViewer>[] = [
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
                            onClick={() => navigator.clipboard.writeText(payment.proxy_id)}
                        >
                            View
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
