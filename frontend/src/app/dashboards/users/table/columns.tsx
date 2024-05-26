"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import ActionsCell from "./actions_cell"
type ColumnProps = {
    onDelete: (id: string) => void
}

export const getColumns = ({ onDelete }: ColumnProps): ColumnDef<UserInput>[] => [{
    cell: ({ row }) => {
        return (
            <span key={row.original.id}>
                {row.index + 1}
            </span>
        )
    },
    header: "No."
},
{
    accessorKey: "username",
    header: "Name",
},
{
    accessorKey: "role",
    header: "Role",
    cell: (state) => {
        const value = state.getValue()

        if (value === undefined || value === null)
            return null;

        if (value === 0) {
            return "Admin"
        }
        return "User"
    }
},
{
    header: "Created At",
    accessorKey: "created_at",
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
    header: "Updated At",
    accessorKey: "updated_at",
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
            <ActionsCell user={payment} onDelete={onDelete} />
        )
    },
}
]
