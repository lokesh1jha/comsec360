"use client";
import { buttonVariants } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

const Sidebar = () => {
	const currentPath = usePathname();
	const [admin, setAdmin] = useState(false);
	const [incorporation, setIncorporation] = useState(false);
	const [annualReturn, setAnnualReturn] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const handleCollapsibleChange = useCallback(
		(title: string) => {
			if (title === "Admin") {
				setAdmin((prev) => !prev);
			} else if (title === "Incorporation") {
				setIncorporation((prev) => !prev);
			} else if (title === "Annual Return") {
				setAnnualReturn((prev) => !prev);
			}
		},
		[setAdmin, setIncorporation, setAnnualReturn],
	);

	return (
		<aside className="hidden border-r bg-muted/40 md:block px-2 animate-in slide-in-from-left-72 delay-300 duration-700">
			<div className="flex h-full max-h-screen flex-col gap-2 fixed">
				<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
					<Link href="/admin" className="flex items-center gap-2 font-semibold">
						<Image
							src="/logo/logo.png"
							width={24}
							height={24}
							alt="logo"
							loading="eager"
						/>
						<span className="">ComSec360 Admin</span>
					</Link>
				</div>
				<div className="flex-1">
					<nav className="grid items-start text-sm font-medium gap-4 mt-6">
						<Link
							href="/admin"
							className={cn("sidebar-button", {
								"bg-muted text-primary": "/admin" === currentPath,
							})}
						>
							<LayoutGrid className="size-4" /> Dashboard
						</Link>
						<h1 className="text-[1.01rem] font-medium mt-4">Projects</h1>
						{navItems.map((item) => (
							<Collapsible
								key={item.title}
								open={
									item.title === "Admin"
										? admin
										: item.title === "Incorporation"
											? incorporation
											: annualReturn
								}
								onOpenChange={() => handleCollapsibleChange(item.title)}
								className="ml-3"
							>
								<CollapsibleTrigger
									className={buttonVariants({
										variant: "ghost",
										className: "flex gap-3 mb-2",
									})}
								>
									{item.icon} {item.title}
								</CollapsibleTrigger>
								<CollapsibleContent className="CollapsibleContent">
									<div className="px-4 flex flex-col space-y-3">
										{item.items.map((subItem) => (
											<Link
												key={subItem.href}
												href={subItem.href}
												className={cn("sidebar-button", {
													"bg-muted text-primary": subItem.href === currentPath,
												})}
											>
												{subItem.icon} {subItem.title}
											</Link>
										))}
									</div>
								</CollapsibleContent>
							</Collapsible>
						))}
					</nav>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
