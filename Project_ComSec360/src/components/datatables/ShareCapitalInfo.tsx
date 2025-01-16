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
import { shareCapitalRows } from "@/lib/constants";
import { useShareCapitalStore } from "@/store/ShareCapitalStore";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import SharesAllotment from "../popups/SharesAllotment";
import EditShareCapital from "../popups/EditShareCapital";

const ShareCapitalInfo = () => {
  const shareCapitalData = useShareCapitalStore(
    (state) => state.shareCapitalData
  );
  const deleteShareCapitalData = useShareCapitalStore(
    (state) => state.deleteShareCapitalData
  );

  function deleteObjectById(id: number) {
    deleteShareCapitalData(id);
    toast.success("Share Capital Entry has been deleted successfully!!");
  }

  return (
    <Card>
      <CardContent>
        <Table>
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
                  <SharesAllotment
                    numberOfShares={item.paid}
                    classOfShares={item.class}
                  />
                </TableCell>
                <TableCell>{item.unpaid}</TableCell>
                <TableCell>{item.rightsAttached}</TableCell>
                <TableCell>
                  <EditShareCapital id={item.id} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deleteObjectById(item.id)}
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

export default ShareCapitalInfo;