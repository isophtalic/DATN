"use client"
import React, { useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getPaginationRowModel,
    SortingState,
    PaginationState,
    Cell,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<ActionsView, TValue> {
    columns: ColumnDef<ActionsView, TValue>[];
    data: ActionsView[];
    pagination: PaginationState;
    pageCount: number;
    onSetPagination: (pagination: PaginationState) => void;
}

export function DataTable<ActionsView, TValue>({
    columns,
    data,
    pagination,
    pageCount,
    onSetPagination,
}: DataTableProps<ActionsView, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        initialState: {
            pagination,
        },
        state: {
            sorting,
            pagination,
        },
        pageCount,
        manualPagination: true,
    });

    const router = useRouter();
    const id = useId();

    useEffect(() => {
        table.setPageCount(pageCount);
        table.setOptions((prev) => ({
            ...prev,
            data,
        }));
    }, [data, pageCount, table]);

    const handleNextPage = () => {
        if (table.getCanNextPage()) {
            const newPagination = {
                pageIndex: table.getState().pagination.pageIndex + 1,
                pageSize: table.getState().pagination.pageSize,
            };
            onSetPagination(newPagination);
            table.setPageIndex(newPagination.pageIndex);
        }
    };

    const handlePreviousPage = () => {
        if (table.getCanPreviousPage()) {
            const newPagination = {
                pageIndex: table.getState().pagination.pageIndex - 1,
                pageSize: table.getState().pagination.pageSize,
            };
            onSetPagination(newPagination);
            table.setPageIndex(newPagination.pageIndex);
        }
    };

    const getStyleActionsCell = (cell: Cell<ActionsView, unknown>) => {
        return cell.id.includes("actions") ? "w-[50px]" : "";
    };

    const getStyleUpdatedCell = (cell: Cell<ActionsView, unknown>) => {
        return cell.id.includes("updated") ? "w-[24rem]" : "";
    };

    const viewDetail = (rowId: string) => {
        router.push(`/dashboards/audit_logs/${rowId}`);
    };

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={`${headerGroup.id}-${id}`}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => viewDetail(data[row.index].id)}
                                    className="cursor-pointer hover:bg-slate-200"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`${getStyleActionsCell(cell)} ${getStyleUpdatedCell(cell)}`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
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
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
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
        </div>
    );
}
