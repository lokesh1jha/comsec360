import {
  Card,
  CardContent,
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
import LinkButton from "../LinkButton";
import { DirectorDocuments } from "../Main";

const IDProof = ({ directorDocuments }: { directorDocuments: DirectorDocuments }) => {
const type = directorDocuments.type.toLowerCase();
  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Proof</CardTitle>
        <CardDescription>
          Here is a summary on your submitted ID Proofs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No.</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Review your Documents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">1</TableCell>
              <TableCell>ID Proof</TableCell>
              <TableCell>
                <LinkButton
                  href={directorDocuments.idProof}
                />
              </TableCell>
            </TableRow>
            {type === 'person' && <TableRow>
              <TableCell className="font-medium">2</TableCell>
              <TableCell>Address Proof</TableCell>
              <TableCell>
                <LinkButton
                  href={directorDocuments.addressProof ?? ""}
                />
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IDProof;
