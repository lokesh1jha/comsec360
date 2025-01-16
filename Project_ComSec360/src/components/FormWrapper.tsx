"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { buttonVariants } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type Props = {
	name: "Share Capital" | "Director" | "Shareholder";
	dataTable: React.ReactNode;
	inviteForm?: React.ReactNode;
	form?: React.ReactNode;
	shareCapitalForm?: React.ReactNode;
};

const FormWrapper = ({
	name,
	dataTable,
	inviteForm,
	form,
	shareCapitalForm,
}: Props) => {
	const [isOpen, setIsOpen] = useState(true);
	const [value, setValue] = useState("");
	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
			<Card>
				<div className="flex justify-between items-center">
					<CardHeader>
						<CardTitle>{name}</CardTitle>
						<CardDescription>Here are the details on {name}</CardDescription>
					</CardHeader>
					<CollapsibleTrigger
						type="button"
						className={buttonVariants({
							variant: "outline",
							size: "icon",
							className: "sm:mr-6 mr-3",
						})}
					>
						{isOpen ? "-" : "+"}
					</CollapsibleTrigger>
				</div>
				<CardContent className="space-y-6">
					<CollapsibleContent className="CollapsibleContent *:py-6">
						{dataTable}
					</CollapsibleContent>
				</CardContent>
				{name === "Share Capital" && shareCapitalForm}
				{name !== "Share Capital" && (
					<RadioGroup value={value} onChange={() => setValue}>
						<div className="flex items-center space-x-2 py-6">
							<RadioGroupItem value="self" id="r1" checked={value === "self"} />
							<Label htmlFor="r1" className="text-2xl">
								Fill in all the information for this {name}
							</Label>
						</div>
						<div
							className={cn({
								hidden: value === "invite" || value === "",
							})}
						>
							{form}
						</div>
						<div className="flex items-center space-x-2 py-6">
							<RadioGroupItem
								value="invite"
								id="r2"
								checked={value === "invite"}
							/>
							<Label htmlFor="r2" className="text-2xl">
								Invite a {name} to fill in the details.
							</Label>
						</div>
						<div
							className={cn({
								hidden: value === "self" || value === null,
							})}
						>
							{inviteForm}
						</div>
					</RadioGroup>
				)}
			</Card>
		</Collapsible>
	);
};

export default FormWrapper;
