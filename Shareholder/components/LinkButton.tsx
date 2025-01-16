import Link from "next/link";
import { buttonVariants } from "./ui/button";

const LinkButton = ({ href }: { href: string }) => {
  return (
    <Link
      target="_blank"
      href={href}
      className={buttonVariants({ variant: "outline" })}
    >
      Preview
    </Link>
  );
};

export default LinkButton;
