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
import ActionsCell from "./actions_cell"

type SecRuleSetColumnProps = {
    onDelete: (id: string) => void
}

export const getColumns = ({ onDelete }: SecRuleSetColumnProps): ColumnDef<SecRuleInterface>[] => [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        className="w-full justify-start pl-0"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
    {
        accessorKey: "debug_log_level",
        header: "Debug Log Level",
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: (a) => {
            const value = `${a.getValue()}`

            if (value === '')
                return null;

            const date = new Date(value);
            const day = date.toLocaleDateString('en-US', { day: '2-digit' }); // Zero-padded day
            const month = date.toLocaleDateString('en-US', { month: '2-digit' }); // Zero-padded month
            const year = date.getFullYear();
            return `${day} / ${month} / ${year} `;
        },
    },
    {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: (a) => {
            const value = `${a.getValue()}`

            if (value === '')
                return null;

            const date = new Date(value);
            const day = date.toLocaleDateString('en-US', { day: '2-digit' }); // Zero-padded day
            const month = date.toLocaleDateString('en-US', { month: '2-digit' }); // Zero-padded month
            const year = date.getFullYear();
            return `${day} / ${month} / ${year} `;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original
            return (
                <ActionsCell id={payment.secrule_id} onDeleteItem={onDelete} />
            )
        },
    },
]
