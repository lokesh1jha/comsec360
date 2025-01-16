import Link from "next/link";
import { buttonVariants } from "./ui/button";

const LinkButton = ({ href }: { href: string }) => {
  return (
    <Link
      href={href}
      target="_blank"
      className={buttonVariants({ variant: "outline" })}
    >
      Preview
    </Link>
  );
};

export default LinkButton;
