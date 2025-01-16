import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Props = {
  name: "Document" | "Email";
  content: {
    id: number;
    title: string;
    href: string;
  }[];
};

const IncorporationWrapper = ({ name, content }: Props) => {
  return (
    <section className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>{name} Templates</CardTitle>
          <CardDescription>
            This is the preview of {name} Templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of All {name} Templates.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Sr No.</TableHead>
                <TableHead>{name}s</TableHead>
                <TableHead>Templates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Link
                      href={item.href}
                      className={buttonVariants({ variant: "outline" })}
                      target="_blank"
                    >
                      Preview
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default IncorporationWrapper;
