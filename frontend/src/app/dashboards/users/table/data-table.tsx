"use client"
import React, { useId, useEffect } from "react"
import { useRouter } from "next/navigation"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getPaginationRowModel,
    SortingState,
    ColumnFiltersState,
    getFilteredRowModel,
    PaginationState,
    Cell,
} from "@tanstack/react-table"


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import { Button } from "@/components/ui/button"

interface DataTableProps<UserInput, TValue> {
    columns: ColumnDef<UserInput, TValue>[]
    data: UserInput[],
    pagination: PaginationState,
    pageCount: number,
    onSetPagination: (pagination: PaginationState) => void
}

export function DataTable<UserInput, TValue>({
    columns,
    data,
    pagination,
    pageCount,
    onSetPagination,
}: DataTableProps<UserInput, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: pagination
        },
        state: {
            sorting,
            pagination: pagination,
        },
        pageCount,
        manualPagination: true,
    })

    // const [state, setState] = useState<PaginationState>(table.getState().pagination)

    // useEffect(() => {
    //     console.log("🚀 ~ state:", state)
    // })

    useEffect(() => {
        table.setPageCount(pageCount);
        table.setOptions((prev) => ({
            ...prev,
            data,
        }));
    }, [data, pageCount, table]);

    const router = useRouter()

    const handleNextPage = () => {
        // console.log("🚀 ~ handleNextPage ~ pagination:", pagination)
        if (table.getCanNextPage()) {
            pagination = {
                pageIndex: table.getState().pagination.pageIndex + 1,
                pageSize: table.getState().pagination.pageSize
            }
            // setState(pagination)
            onSetPagination(pagination)
            table.nextPage()
        }
    }

    const handlePrevousPage = () => {
        if (table.getCanPreviousPage()) {
            table.previousPage()
            pagination = {
                pageIndex: table.getState().pagination.pageIndex - 1,
                pageSize: table.getState().pagination.pageSize
            }
            onSetPagination(pagination)
        }
    }

    const getStyleActionsCell = (cell: Cell<UserInput, unknown>) => {
        return cell.id.includes("actions") ? "w-[50px]" : ""
    }

    const getStyleUpdatedCell = (cell: Cell<UserInput, unknown>) => {
        return cell.id.includes("updated") ? "w-[24rem]" : ""
    }

    let id = useId()
    // const getCellAlignment = (column: ColumnDef<TData, TValue>) => {
    //     console.log(column.accessorKey);
    //     return column.accessorKey === "status" ? "text-center;" : "";
    // }

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table?.getRowModel().rows?.length ? (
                            table?.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="pointer-event-none hover:bg-slate-200"
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell key={cell.id} className={`${getStyleActionsCell(cell)} ${getStyleUpdatedCell(cell)}`}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevousPage}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div >

    )
}
