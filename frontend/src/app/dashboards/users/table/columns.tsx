"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
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
            <div className="flex flex-row justify-end">
                <div onClick={() => onDelete(payment.id as string)} className="cursor-pointer w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border hover:border-sky-500">
                    <TrashIcon className='w-6 h6' />
                </div>
                <div className="w-5"></div>
                <Link className="cursor-pointer w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border  hover:border-sky-500" href={`/dashboards/users/${payment.id}/reset-pass`}>
                    <PencilSquareIcon className='w-6 h6' />
                </Link>
            </div>
        )
    },
}
]
