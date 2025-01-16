"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import * as React from "react";

const data: CompanyData[] = [
    {
        id: "c1e2d3f4",
        company: "Alibaba Group Holding Limited",
        incorporated: "20-01-2020",
        next: "20-01-2021",
        inProcessing: 3,
        financialDate: "20-01-2021",
      },
      {
        id: "g5e6r7t8",
        company: "Tencent Holdings Limited",
        incorporated: "15-05-2018",
        next: "15-05-2019",
        inProcessing: 2,
        financialDate: "15-05-2019",
      },
      {
        id: "b9y8d7c6",
        company: "Baidu, Inc.",
        incorporated: "10-09-2021",
        next: "10-09-2022",
        inProcessing: 1,
        financialDate: "10-09-2022",
      },
      {
        id: "m3i2n1g0",
        company: "JD.com, Inc.",
        incorporated: "08-12-2019",
        next: "08-12-2020",
        inProcessing: 4,
        financialDate: "08-12-2020",
      },
      {
        id: "s4i5n6o7p",
        company: "PetroChina Company Limited",
        incorporated: "25-03-2017",
        next: "25-03-2018",
        inProcessing: 2,
        financialDate: "25-03-2018",
      },
      {
        id: "w8e7i6b5o",
        company: "Xiaomi Corporation",
        incorporated: "14-07-2016",
        next: "14-07-2017",
        inProcessing: 1,
        financialDate: "14-07-2017",
      },
      {
        id: "s2o0h2u1",
        company: "China Mobile Limited",
        incorporated: "03-11-2015",
        next: "03-11-2016",
        inProcessing: 3,
        financialDate: "03-11-2016",
      },
      {
        id: "n9e8t7e6a",
        company: "Huawei Technologies Co., Ltd.",
        incorporated: "19-06-2019",
        next: "19-06-2020",
        inProcessing: 2,
        financialDate: "19-06-2020",
      },
      {
        id: "l5e6n7o8v",
        company: "ZTE Corporation",
        incorporated: "28-02-2018",
        next: "28-02-2019",
        inProcessing: 1,
        financialDate: "28-02-2019",
      },
      {
        id: "o2n0e2t1w",
        company: "China Southern Airlines Company Limited",
        incorporated: "07-04-2020",
        next: "07-04-2021",
        inProcessing: 4,
        financialDate: "07-04-2021",
      },
      {
        id: "t3w2e1n0t",
        company: "Sina Corporation",
        incorporated: "16-08-2017",
        next: "16-08-2018",
        inProcessing: 2,
        financialDate: "16-08-2018",
      },
      {
        id: "b8l7u6e5b",
        company: "BYD Company Limited",
        incorporated: "22-12-2019",
        next: "22-12-2020",
        inProcessing: 3,
        financialDate: "22-12-2020",
      },
      {
        id: "m4i5a6o7t",
        company: "China Life Insurance Company Limited",
        incorporated: "10-03-2016",
        next: "10-03-2017",
        inProcessing: 1,
        financialDate: "10-03-2017",
      },
      {
        id: "z1t9e8c7h",
        company: "China Construction Bank Corporation",
        incorporated: "05-05-2018",
        next: "05-05-2019",
        inProcessing: 4,
        financialDate: "05-05-2019",
      },
      {
        id: "h2a0r2b1i",
        company: "China Petroleum & Chemical Corporation (Sinopec)",
        incorporated: "14-09-2020",
        next: "14-09-2021",
        inProcessing: 2,
        financialDate: "14-09-2021",
      },
      {
        id: "t8e7n6c5e",
        company: "China Shenhua Energy Company Limited",
        incorporated: "27-11-2017",
        next: "27-11-2018",
        inProcessing: 1,
        financialDate: "27-11-2018",
      },
      {
        id: "c3m2c1h0i",
        company: "Bank of China Limited",
        incorporated: "02-04-2019",
        next: "02-04-2020",
        inProcessing: 3,
        financialDate: "02-04-2020",
      },
      {
        id: "l9e8d7i6n",
        company: "China Merchants Bank Co., Ltd.",
        incorporated: "19-07-2018",
        next: "19-07-2019",
        inProcessing: 2,
        financialDate: "19-07-2019",
      },
      {
        id: "s5u6n7g8b",
        company: "China Unicom (Hong Kong) Limited",
        incorporated: "08-10-2016",
        next: "08-10-2017",
        inProcessing: 4,
        financialDate: "08-10-2017",
      },
      {
        id: "h4a5i6e7r",
        company: "China Pacific Insurance (Group) Co., Ltd.",
        incorporated: "25-01-2020",
        next: "25-01-2021",
        inProcessing: 3,
        financialDate: "25-01-2021",
      },
      {
        id: "n3o2r1e0p",
        company: "China Telecom Corporation Limited",
        incorporated: "18-04-2019",
        next: "18-04-2020",
        inProcessing: 2,
        financialDate: "18-04-2020",
      },
      {
        id: "f8o7r6t5u",
        company: "China Southern Power Grid Co., Ltd.",
        incorporated: "23-06-2017",
        next: "23-06-2018",
        inProcessing: 1,
        financialDate: "23-06-2018",
      },
      {
        id: "w2o1n0g9l",
        company: "China National Offshore Oil Corporation (CNOOC)",
        incorporated: "12-09-2020",
        next: "12-09-2021",
        inProcessing: 4,
        financialDate: "12-09-2021",
      },
      {
        id: "b1y0d2c3o",
        company: "China Minsheng Banking Corp., Ltd.",
        incorporated: "27-12-2018",
        next: "27-12-2019",
        inProcessing: 2,
        financialDate: "27-12-2019",
      },
      {
        id: "t5h6r7o8u",
        company: "China Evergrande Group",
        incorporated: "03-03-2016",
        next: "03-03-2017",
        inProcessing: 3,
        financialDate: "03-03-2017",
      },
      {
        id: "t3e2n1c0e",
        company: "China Yangtze Power Co., Ltd.",
        incorporated: "14-07-2019",
        next: "14-07-2020",
        inProcessing: 1,
        financialDate: "14-07-2020",
      },
      {
        id: "l8e7i6s5h",
        company: "China CITIC Bank Corporation Limited",
        incorporated: "29-10-2016",
        next: "29-10-2017",
        inProcessing: 4,
        financialDate: "29-10-2017",
      },
      {
        id: "s2u0n2i1n",
        company: "China Communications Construction Company Limited",
        incorporated: "05-02-2018",
        next: "05-02-2019",
        inProcessing: 3,
        financialDate: "05-02-2019",
      },
      {
        id: "c9h8a7n6g",
        company: "China Merchants Group",
        incorporated: "20-05-2020",
        next: "20-05-2021",
        inProcessing: 2,
        financialDate: "20-05-2021",
      },
      {
        id: "l4i5u6a7o",
        company: "China Datang Corporation",
        incorporated: "11-08-2017",
        next: "11-08-2018",
        inProcessing: 1,
        financialDate: "11-08-2018",
      },
];

export type CompanyData = {
  id: string;
  company: string;
  incorporated : string;
  next: string;
  inProcessing: number;
  financialDate: string;
};

export const columns: ColumnDef<CompanyData>[] = [
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("company")}</div>
    ),
  },
  {
    accessorKey: "incorporated",
    header: () => <div className="text-right">Incorporated Date</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("incorporated")}</div>
      );
    },
  },
  {
    accessorKey: "next",
    header: () => <div className="text-right">Next Annual Return Date</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("next")}</div>
      );
    },
  },
  {
    accessorKey: "inProcessing",
    header: () => <div className="text-right">Projects In-Processing</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium text-yellow-400 dark:text-yellow-500">
          {row.getValue("inProcessing")}
        </div>
      );
    },
  },
  {
    accessorKey: "financialDate",
    header: () => <div className="text-right">Financial Date</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("financialDate")}
        </div>
      );
    },
  },
];

export function Companies() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter companies..."
          value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("company")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
