import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { poppins } from "@/fonts";
import "@/styles/globals.css";
import SiteHeader from "@/components/header/nav";
import Sidebar from "./_components/sidebar/Sidebar";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "ComSec360 - Admin",
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
				<SiteHeader />
				<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr]">
					<Sidebar />
					<div className="overflow-x-hidden">{children}</div>
				</div>
				<Toaster />
			</div>
		</div>
	);
}
