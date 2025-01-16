"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCompanyDocumentStatus } from "@/api/company";
const accountUserUrl = process.env.NEXT_PUBLIC_CS_ACCOUNT_USER_URL ?? 'http://52.59.5.100:3000'

const getNextLink = async (id: string) => {
  const isDocumentGeneratedForCompany = await getCompanyDocumentStatus(id);
  if (isDocumentGeneratedForCompany.data > 0) {
    return `/document_status/${id}`;
  }
  return null;
};

export type ProjectData = {
  id: string;
  status: "Preparation" | "In-Processing" | "Completed" | "strated" | "in_progress" | "completed";
  company: string;
  project: string;
  start: string;
  due: string;
  published: number;
  processBy: string;
};

export const createColumns = (token: string | null, user: string | null, type: string | null): ColumnDef<ProjectData>[] => [
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
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
    cell: ({ row }) => {
      const href = `${accountUserUrl}/summary?token=${token}&type=${type}&user=${encodeURIComponent(user ?? "")}&companyId=${row.original.id}`;
      return (
        <div className="capitalize">
          <Link
            href={href}
            className={buttonVariants({ variant: "link" })}
          >
            {row.getValue("company")}
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          <Link
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              const link = await getNextLink(row.original.id);
              if (link) {
                window.location.href = link;
              }
            }}
            className={buttonVariants({ variant: "link" })}
          >
            {row.getValue("project")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "start",
    header: () => <div className="text-right">Start Date</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("start") ? format(new Date(row.getValue("start")), "dd-MMM-yyyy") : "-"}</div>
      );
    },
  },
  {
    accessorKey: "due",
    header: () => <div className="text-right">Due/Completed Dates</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("due") ? format(new Date(row.getValue("due")), "dd-MMM-yyyy") : "-"}</div>
      );
    },
  },
  {
    accessorKey: "published",
    header: () => <div className="text-right">Published Documents</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-right">
          <Link
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              const link = await getNextLink(row.original.id);
              if (link) {
                window.location.href = link;
              }
            }}
            className={buttonVariants({ variant: "link" })}
          >
            {row.getValue("published")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "processBy",
    header: () => <div className="text-right">Processed By</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("processBy")}
        </div>
      );
    },
  },
];

export function Projects({ projects }: { projects: ProjectData[] }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const type = localStorage.getItem("type");

    setToken(token);
    setUser(user);
    setType(type);
  }, []);

  const columns = createColumns(token, user, type);
  const [isOpen, setIsOpen] = useState(false);
  const [projectStartDate, setProjectStartDate] = useState<Date | undefined>(new Date());
  const [projectEndDate, setProjectEndDate] = useState<Date | undefined>(new Date());
  const [projectDueStartDate, setProjectDueStartDate] = useState<Date | undefined>(
    new Date()
  );
  const [projectDueEndDate, setProjectDueEndDate] = useState<Date | undefined>(new Date());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});


  useEffect(() => {
    const filters: any[] = [];

    // Filter by start date range
    if (projectStartDate && projectEndDate) {
      const startDate = Date.parse(projectStartDate.toDateString());
      const endDate = Date.parse(projectEndDate.toDateString());

      if (startDate) {
        filters.push({
          id: "start",
          value: startDate,
          operator: ">=",
        });
      }

      if (endDate) {
        filters.push({
          id: "start",
          value: endDate,
          operator: "<=",
        });
      }
    }

    // Filter by due date range (if dates are selected)
    if (projectDueStartDate && projectDueEndDate) {
      const dueStartDate = Date.parse(projectDueStartDate.toDateString());
      const dueEndDate = Date.parse(projectDueEndDate.toDateString());

      if (dueStartDate) {
        filters.push({
          id: "due",
          value: dueStartDate,
          operator: ">=",
        });
      }

      if (dueEndDate) {
        filters.push({
          id: "due",
          value: dueEndDate,
          operator: "<=",
        });
      }
    }

    // Set column filters if any filters exist
    if (filters.length > 0) {
      // setColumnFilters(filters);
    }
  }, [projectStartDate, projectEndDate, projectDueStartDate, projectDueEndDate]);


  const table = useReactTable({
    data: projects,
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
      columnVisibility,
      columnFilters,
      rowSelection
    },
  });

  return (
    <div className="w-full">
      <Collapsible open={isOpen}
        onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild className="my-4"><Button>Search<Search size={16} className="ml-2" /></Button></CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <div className="flex items-center gap-6 justify-between py-4">
            <Input
              placeholder="Search..."
              value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("company")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex items-start gap-6 flex-col">
              <span>Project Start Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !projectStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {projectStartDate ? (
                      format(projectStartDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick a Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={projectStartDate}
                    onSelect={setProjectStartDate}
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
                      !projectEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {projectEndDate ? (
                      format(projectEndDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick an End Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={projectEndDate}
                    onSelect={setProjectEndDate}
                    fromYear={1960}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Input
              placeholder="Search Processed By..."
              value={
                (table.getColumn("processBy")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("processBy")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex items-start gap-6 flex-col">
              <span>Project Due/Completed Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !projectDueStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {projectDueStartDate ? (
                      format(projectDueStartDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick a Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={projectDueStartDate}
                    onSelect={setProjectDueStartDate}
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
                      !projectDueEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {projectDueEndDate ? (
                      format(projectDueEndDate, "dd-MMM-yyyy")
                    ) : (
                      <span>Pick an End Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={projectDueEndDate}
                    onSelect={setProjectDueEndDate}
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
          </div></CollapsibleContent>
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
            {projects && table.getRowModel().rows?.length ? (
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
