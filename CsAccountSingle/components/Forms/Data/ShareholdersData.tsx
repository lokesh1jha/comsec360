import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shareholdersContent, shareholdersRows } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import ShareDetailsPopup from "./ShareDetailsPopup";
import { useShareHolderStore } from "@/store/shareHolderDataStore";
import EditShareHolder from "./EditShareHolder";
import { useDataContext } from "@/context/ContextProvider";

const ShareholdersData = () => {
  const shareholdersContent = useShareHolderStore(
    (state) => state.shareHolderData
  );
  const deleteShareHolderData = useShareHolderStore(
    (state) => state.deleteShareHolderData
  )
  const { companyId } = useDataContext()

  function deleteObjectById(id: number): void {
    deleteShareHolderData(id, companyId)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {shareholdersRows.map((row) => (
            <TableHead
              key={row.for}
              className={cn({
                hidden: row.for === "classOfShares" || row.for === "totalShares",
              })}
            >
              {row.label}
            </TableHead>
          ))}
          <TableHead>Share Details</TableHead>
          <TableHead>Edit</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shareholdersContent && shareholdersContent.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.surname}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.idNo}</TableCell>
            <TableCell>{item.address}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
            <TableCell><ShareDetailsPopup name={item.name} surname={item.surname} details={item.sharesDetails} /></TableCell>
            <TableCell>
              {item.id && <EditShareHolder id={item.id} />}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                onClick={() => {if(item.id)  deleteObjectById(item.id)}}
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

export default ShareholdersData;
