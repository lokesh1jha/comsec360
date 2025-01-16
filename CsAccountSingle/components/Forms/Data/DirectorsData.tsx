import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shareholdersRows } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useDirectorStore } from "@/store/directorStore";
import { Pencil, Trash2 } from "lucide-react";
import EditDirector from "./EditDirector";
import { use, useEffect, useState } from "react";

const DirectorsData = () => {
  const [companyId, setCompanyId] = useState<string>("");

  const DirectorsContent = useDirectorStore(
    (state) => state.directorData
  );
  const deleteShareHolderData = useDirectorStore(
    (state) => state.deleteDirectorData
  )
  function deleteObjectById(id: number): void {
    deleteShareHolderData(id, companyId)
  }


  useEffect(() => {
    if (typeof window !== "undefined") {
      const company_id = localStorage.getItem("companyId")
      if (company_id) setCompanyId(company_id)
    }
  }, [])


  return (
    <Table>
      <TableHeader>
        <TableRow>
          {shareholdersRows.map((row) => (
            <TableHead
              key={row.for}
              className={cn({
                "hidden": row.for === "classOfShares" || row.for === "totalShares",
              })}
            >
              {row.label}
            </TableHead>
          ))}
          <TableHead>Edit</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {DirectorsContent && DirectorsContent.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.surname}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.idNo}</TableCell>
            <TableCell>{item.address}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
            <TableCell>
              {item.id && <EditDirector id={item.id} />}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                onClick={() => { if (item.id) deleteObjectById(item.id) }}
                size="icon"
              >
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

  );
};

export default DirectorsData;
