import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { poppins } from "@/fonts";
import "@/styles/globals.css";
import SiteHeader from "@/components/header/nav";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "ComSec360 - Projects-New",
	description:
		"Welcome to ComSec360. Manage your Company registerations in HongKong with ease.",
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div
			className={cn(
				"min-h-screen bg-background font antialiased",
				poppins.variable,
			)}
		>
			<div className="relative">
				<SiteHeader user="Account User" />
					<div>{children}</div>
				<Toaster />
			</div>
		</div>
	);
}
