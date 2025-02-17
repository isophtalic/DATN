"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
type AccesslistColumnProps = {
    onDelete: (id: string) => void
}

export const getColumns= ({ onDelete }: AccesslistColumnProps): ColumnDef<AccesslistInterface>[] => [
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
        accessorKey: "name",
        header: "Name",
    },
    {
        cell: ({ row }) => {
            return (
                <CheckCircleIcon className='w-6 h6 text-green-600' />
            )
        },
        header: "Status",
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
                    <div className="w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border hover:border-sky-500" onClick={() => onDelete(payment.accesslist_id)}>
                        <TrashIcon className='w-6 h6'/>
                    </div>
                    <div className="w-5"></div>
                    <div className="w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border  hover:border-sky-500">
                        <PencilSquareIcon className='w-6 h6' />
                    </div>
                </div>
            )
        },
    }
]
