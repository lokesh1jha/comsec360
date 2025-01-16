"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
import { ArrowUpDown, ChevronDown, CalendarIcon, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const data: CompanyData[] = [
  {
    id: "c1e2d3f4",
    company: "Alibaba Group Holding Limited",
    incorporated: "20-Jan-2020",
    nextAnnual: "14-Aug-2025",
    financialDate: "To Be Confirmed",
  },
  {
    id: "g5e6r7t8",
    company: "Tencent Holdings Limited",
    incorporated: "15-May-2018",
    nextAnnual: "14-Aug-2025",
    financialDate: "To Be Confirmed",
  },
  {
    id: "b9y8d7c6",
    company: "Baidu, Inc.",
    incorporated: "10-Sep-2021",
    nextAnnual: "14-Aug-2025",
    financialDate: "10-Sep-2022",
  },
  {
    id: "m3i2n1g0",
    company: "JD.com, Inc.",
    incorporated: "08-Dec-2019",
    nextAnnual: "14-Aug-2025",
    financialDate: "08-Dec-2020",
  },
  {
    id: "s4i5n6o7p",
    company: "PetroChina Company Limited",
    incorporated: "25-Mar-2017",
    nextAnnual: "14-Aug-2025",
    financialDate: "25-Mar-2018",
  },
  {
    id: "w8e7i6b5o",
    company: "Xiaomi Corporation",
    incorporated: "14-Jul-2016",
    nextAnnual: "14-Aug-2025",
    financialDate: "14-Jul-2017",
  },
  {
    id: "s2o0h2u1",
    company: "China Mobile Limited",
    incorporated: "03-Nov-2015",
    nextAnnual: "14-Aug-2025",
    financialDate: "03-Nov-2016",
  },
  {
    id: "n9e8t7e6a",
    company: "Huawei Technologies Co., Ltd.",
    incorporated: "19-Jun-2019",
    nextAnnual: "14-Aug-2025",
    financialDate: "19-Jun-2020",
  },
  {
    id: "l5e6n7o8v",
    company: "ZTE Corporation",
    incorporated: "28-Feb-2018",
    nextAnnual: "14-Aug-2025",
    financialDate: "28-Feb-2019",
  },
  {
    id: "o2n0e2t1w",
    company: "China Southern Airlines Company Limited",
    incorporated: "07-Apr-2020",
    nextAnnual: "14-Aug-2025",
    financialDate: "07-Apr-2021",
  },
  {
    id: "t3w2e1n0t",
    company: "Sina Corporation",
    incorporated: "16-Aug-2017",
    nextAnnual: "14-Aug-2025",
    financialDate: "16-Aug-2018",
  },
  {
    id: "b8l7u6e5b",
    company: "BYD Company Limited",
    incorporated: "22-Dec-2019",
    nextAnnual: "14-Aug-2025",
    financialDate: "22-Dec-2020",
  },
  {
    id: "m4i5a6o7t",
    company: "China Life Insurance Company Limited",
    incorporated: "10-Mar-2016",
    nextAnnual: "14-Aug-2025",
    financialDate: "10-Mar-2017",
  },
  {
    id: "z1t9e8c7h",
    company: "China Construction Bank Corporation",
    incorporated: "05-May-2018",
    nextAnnual: "14-Aug-2025",
    financialDate: "To Be Confirmed",
  },
  {
    id: "h2a0r2b1i",
    company: "China Petroleum & Chemical Corporation (Sinopec)",
    incorporated: "14-Sep-2020",
    nextAnnual: "14-Aug-2025",
    financialDate: "14-Sep-2021",
  },
  {
    id: "t8e7n6c5e",
    company: "China Shenhua Energy Company Limited",
    incorporated: "27-Nov-2017",
    nextAnnual: "14-Aug-2025",
    financialDate: "27-Nov-2018",
  },
  {
    id: "c3m2c1h0i",
    company: "Bank of China Limited",
    incorporated: "02-Apr-2019",
    nextAnnual: "14-Aug-2025",
    financialDate: "02-Apr-2020",
  },
  {
    id: "l9e8d7i6n",
    company: "China Merchants Bank Co., Ltd.",
    incorporated: "19-Jul-2018",
    nextAnnual: "14-Aug-2025",
    financialDate: "19-Jul-2019",
  },
  {
    id: "s5u6n7g8b",
    company: "China Unicom (Hong Kong) Limited",
    incorporated: "08-Oct-2016",
    nextAnnual: "14-Aug-2025",
    financialDate: "08-Oct-2017",
  },
  {
    id: "h4a5i6e7r",
    company: "China Pacific Insurance (Group) Co., Ltd.",
    incorporated: "25-Jan-2020",
    nextAnnual: "14-Aug-2025",
    financialDate: "25-Jan-2021",
  },
  {
    id: "n3o2r1e0p",
    company: "China Telecom Corporation Limited",
    incorporated: "18-Apr-2019",
    nextAnnual: "14-Aug-2025",
    financialDate: "18-Apr-2020",
  },
  {
    id: "f8o7r6t5u",
    company: "China Southern Power Grid Co., Ltd.",
    incorporated: "23-Jun-2017",
    nextAnnual: "14-Aug-2025",
    financialDate: "23-Jun-2018",
  },
  {
    id: "w2o1n0g9l",
    company: "China National Offshore Oil Corporation (CNOOC)",
    incorporated: "12-Sep-2020",
    nextAnnual: "14-Aug-2025",
    financialDate: "12-Sep-2021",
  },
  {
    id: "b1y0d2c3o",
    company: "China Minsheng Banking Corp., Ltd.",
    incorporated: "27-Dec-2018",
    nextAnnual: "14-Aug-2025",
    financialDate: "27-Dec-2019",
  },
  {
    id: "t5h6r7o8u",
    company: "China Evergrande Group",
    incorporated: "03-Mar-2016",
    nextAnnual: "14-Aug-2025",
    financialDate: "03-Mar-2017",
  },
  {
    id: "t3e2n1c0e",
    company: "China Yangtze Power Co., Ltd.",
    incorporated: "14-Jul-2019",
    nextAnnual: "14-Aug-2025",
    financialDate: "14-Jul-2020",
  },
  {
    id: "l8e7i6s5h",
    company: "China CITIC Bank Corporation Limited",
    incorporated: "29-Oct-2016",
    nextAnnual: "14-Aug-2025",
    financialDate: "29-Oct-2017",
  },
  {
    id: "s2u0n2i1n",
    company: "China Communications Construction Company Limited",
    incorporated: "05-Feb-2018",
    nextAnnual: "14-Aug-2025",
    financialDate: "05-Feb-2019",
  },
  {
    id: "c9h8a7n6g",
    company: "China Merchants Group",
    incorporated: "20-May-2020",
    nextAnnual: "14-Aug-2025",
    financialDate: "To Be Confirmed",
  },
  {
    id: "l4i5u6a7o",
    company: "China Datang Corporation",
    incorporated: "11-Aug-2017",
    nextAnnual: "14-Aug-2025",
    financialDate: "11-Aug-2018",
  },
];

export type CompanyData = {
  id: string;
  company: string;
  incorporated: string;
  nextAnnual: string;
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
        <div className="text-right font-medium">
          {row.getValue("incorporated")}
        </div>
      );
    },
  },
  {
    accessorKey: "nextAnnual",
    header: () => <div className="text-right">Next Annual Return Date</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("nextAnnual")}
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
  const [isOpen, setIsOpen] = useState(false);
  const [incorporateStartDate, setIncorporateStartDate] = useState<Date | undefined>(
    new Date()
  );
  const [incorporateEndDate, setIncorporateEndDate] = useState<Date | undefined>(
    new Date()
  );
  const [annualReturnStartDate, setAnnualReturnStartDate] = useState<Date | undefined>(
    new Date()
  );
  const [annualReturnEndDate, setAnnualReturnEndDate] = useState<Date | undefined>(
    new Date()
  );
  const [financialStartDate, setFinancialStartDate] = useState<Date | undefined>(
    new Date()
  );
  const [financialEndDate, setFinancialEndDate] = useState<Date | undefined>(new Date());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild className="my-4">
          <Button>
            Search
            <Search size={16} className="ml-2" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <div className="flex items-center gap-6 justify-between py-4">
            <Input
              placeholder="Search..."
              value={
                (table.getColumn("company")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("company")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex items-start gap-6 flex-col">
              <span>Incorporate Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !incorporateStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {incorporateStartDate ? (
                      format(incorporateStartDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick a Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={incorporateStartDate}
                    onSelect={setIncorporateStartDate}
                    fromYear={1960}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !incorporateEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {incorporateEndDate ? (
                      format(incorporateEndDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick an End Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={incorporateEndDate}
                    onSelect={setIncorporateEndDate}
                    fromYear={1960}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-start gap-6 flex-col">
              <span>Annual Return Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !annualReturnStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {annualReturnStartDate ? (
                      format(annualReturnStartDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick a Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={annualReturnStartDate}
                    onSelect={setAnnualReturnStartDate}
                    fromYear={1960}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !annualReturnEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {annualReturnEndDate ? (
                      format(annualReturnEndDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick an End Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={annualReturnEndDate}
                    onSelect={setAnnualReturnEndDate}
                    fromYear={1960}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-start gap-6 flex-col">
              <span>Financial Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !financialStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {financialStartDate ? (
                      format(financialStartDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick a Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={financialStartDate}
                    onSelect={setFinancialStartDate}
                    fromYear={1960}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !financialEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {financialEndDate ? (
                      format(financialEndDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick an End Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={financialEndDate}
                    onSelect={setFinancialEndDate}
                    fromYear={1960}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
            </div>
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
        </CollapsibleContent>
      </Collapsible>
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
