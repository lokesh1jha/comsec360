import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const DirectorsCard = () => {
  const directorsData = useDirectorStore((state) => state.directorData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Directors</CardTitle>
        <CardDescription>Here are the details on Directors</CardDescription>
      </CardHeader>
      <Table className="w-full">
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {directorsData && directorsData.length > 0 ? (
            directorsData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.surname}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.idNo}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone.substring(0, item.phone.length - 10)}XXXXXXXXXX</TableCell> {/* Masking phone number */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No directors found.</TableCell> {/* Fallback UI */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DirectorsCard;
