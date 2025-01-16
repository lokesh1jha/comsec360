import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import NotificationsDropDown from "./Notifications";
import UserDropdown from "./UserDropdown";
import MobileSidebar from "@/app/admin/_components/sidebar/MobileSidebar";

const SiteHeader = ({ user }: { user?: string }) => {
	return (
		<div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<div className="flex items-center gap-1">
					{user !== "Account User" && <MobileSidebar />}
					<Link
						href="/"
						className={buttonVariants({
							variant: "ghost",
							className: "mr-4 flex gap-2",
						})}
					>
						<Image
							src="/logo/logo.png"
							width={32}
							height={32}
							alt="logo-img"
							className="object-contain mix-blend-darken dark:mix-blend-lighten"
						/>
						<span className="md:text-2xl text-xl font-bold text-primary sm:block hidden">
							ComSec360
						</span>
					</Link>
				</div>
				<div className="flex flex-1 justify-end items-center gap-4">
					<ModeToggle/>
					<NotificationsDropDown />
					<UserDropdown
						name="Chun"
						userType="Admin"
						profileImage="/user/user-02.png"
						email="chun@gmail.com"
					/>
				</div>
			</div>
		</div>
	);
};

export default SiteHeader;
