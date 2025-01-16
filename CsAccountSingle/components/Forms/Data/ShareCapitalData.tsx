"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { shareCapitalRows } from "@/lib/constants";
import { useShareCapitalStore } from "@/store/shareCapitalDataStore";
import { Trash2 } from "lucide-react";
import EditShareCapital from "./EditShareCapital";
import SharesPopup from "@/app/summary/Popup";
import { useDataContext } from "@/context/ContextProvider";

const ShareCapitalData = () => {
  const { companyId } = useDataContext();

  const shareCapitalData = useShareCapitalStore(
    (state) => state.shareCapitalData
  );
  
  const deleteShareCapitalData = useShareCapitalStore(
    (state) => state.deleteShareCapitalData
  );
  const { toast } = useToast();

  function deleteObjectById(id: number) {
    console.log("id", id, companyId);
    deleteShareCapitalData(id, companyId);
    toast({
      variant: "destructive",
      title: "Deleted!!",
      description: "The field is deleted successfully.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ShareCapital List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {shareCapitalRows.map((row) => (
                <TableHead key={row.for}>{row.label}</TableHead>
              ))}
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shareCapitalData?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.class}</TableCell>
                <TableCell>{item.totalProposed}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>
                  <SharesPopup
                    numberOfShares={item.paid}
                    classOfShares={item.class}
                  />
                </TableCell>
                <TableCell>{item.unpaid}</TableCell>
                <TableCell>{item.rightsAttached}</TableCell>
                <TableCell>
                 {item.id && <EditShareCapital id={item.id} />}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => item.id && deleteObjectById(item.id)}
                    size="icon"
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShareCapitalData;
