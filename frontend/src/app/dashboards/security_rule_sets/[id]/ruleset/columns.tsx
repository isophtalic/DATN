"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { BlacklistStatus, RuleStatus } from "@/store/constants/const"

// fix detaile rule
export const columns: ColumnDef<RuleSetInterface>[] = [
    {
        cell: ({ row }) => {
            return (
                <span key={row.original.rule_id}>
                    {row.index + 1}
                </span>
            )
        },
        header: "No."
    },
    {
        accessorKey: "id",
        header: "ID Rule",
    },
    {
        accessorKey: "file",
        header: "File",
    },
    {
        accessorKey: "status",
        cell: (cell) => {
            const value = cell.getValue()

            if (value === '')
                return null;

            if (value === RuleStatus.ENABLE) {
                return "enabled"
            }

            return "disabled"
        },
        header: "Status",
    },
    {
        header: "Created At",
        accessorKey: "created_at",
        cell: (cell) => {
            const value = `${cell.getValue()}`

            if (value === '' || value === "undefined")
                return ``;

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
        cell: (cell) => {
            const value = `${cell.getValue()}`

            if (value === '' || value === "undefined")
                return ``;

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
                    <div className="w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border hover:border-sky-500">
                        <TrashIcon className='w-6 h6' />
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
