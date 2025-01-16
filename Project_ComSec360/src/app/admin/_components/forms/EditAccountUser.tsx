"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Pencil } from "lucide-react";
import { AccountUserForm } from "./AccountUserForm";

type Props = {
	user: {
		id: string;
		firstName: string;
		lastName: string;
		password: string;
		email: string;
	};
};

const EditAccountUser = ({ user }: Props) => {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	if (isDesktop) {
		return (
			<Dialog>
				<DialogTrigger
					className={buttonVariants({ variant: "outline", size: "icon" })}
				>
					<Pencil />
				</DialogTrigger>
				<DialogContent className="sm:max-w-lg max-w-md mx-3">
					<DialogHeader>
						<DialogTitle>Edit Account User Info</DialogTitle>
						<DialogDescription>
							Make changes to Account User Information. Click save when
							you&apos;re done.
						</DialogDescription>
					</DialogHeader>
					<AccountUserForm user={{ ...user, type: "account_user" }} />
				</DialogContent>
			</Dialog>
		);
	}
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline" size="icon">
					<Pencil />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Edit Account User Info ( id: {user.id} )</DrawerTitle>
					<DrawerDescription>
						Make changes to Account User Information. Click save when
						you&apos;re done.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<AccountUserForm user={{ ...user, type: "account_user" }} />
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default EditAccountUser;
