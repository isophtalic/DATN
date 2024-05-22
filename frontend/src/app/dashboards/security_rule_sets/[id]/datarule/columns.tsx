"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { BlacklistStatus, RuleStatus } from "@/store/constants/const"
import { useRouter } from "next/navigation"
import ActionsCell from "./actions_cell"

type DataRuleColumnProps = {
    id: string,
    onDelete: (id: string) => void
}

export const getColumns = ({ id, onDelete }: DataRuleColumnProps): ColumnDef<DataRuleInterface>[] => [
    {
        cell: ({ row }) => {
            return (
                <span key={row.original.data_id}>
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
        accessorKey: "description",
        header: "Description",
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
                <ActionsCell id={id} data_id={payment.data_id} onDelete={onDelete} />
            )
        },
    }
]
