import React from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
import { CompanyInfoHoverContent } from "@/lib/constants";

//Company Info
export const CompanyNameHoverCard = () => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<InfoIcon size={20} />
			</HoverCardTrigger>
			<HoverCardContent className="sm:w-96 w-fit">
				<ol className="space-y-3 list-[lower-alpha] *:leading-relaxed px-2 py-2">
					<li>{CompanyInfoHoverContent.name.first}</li>
					<li>{CompanyInfoHoverContent.name.second}</li>
				</ol>
			</HoverCardContent>
		</HoverCard>
	);
};

export const CompanyTypeHoverCard = () => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<InfoIcon size={20} />
			</HoverCardTrigger>
			<HoverCardContent className="leading-relaxed sm:w-80 w-fit">
				{CompanyInfoHoverContent.type}
			</HoverCardContent>
		</HoverCard>
	);
};

export const CompanyAddressHoverCard = () => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<InfoIcon size={20} />
			</HoverCardTrigger>
			<HoverCardContent className="leading-relaxed">
				{CompanyInfoHoverContent.address}
			</HoverCardContent>
		</HoverCard>
	);
};

export const CompanyTimeHoverCard = () => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<InfoIcon size={20} />
			</HoverCardTrigger>
			<HoverCardContent className="leading-relaxed">
				{CompanyInfoHoverContent.time}
			</HoverCardContent>
		</HoverCard>
	);
};

export const CompanyPresentorHoverCard = () => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<InfoIcon size={20} />
			</HoverCardTrigger>
			<HoverCardContent className="font-normal leading-relaxed text-base">
				{CompanyInfoHoverContent.presentor}
			</HoverCardContent>
		</HoverCard>
	);
};

//Shares Info

export const RightsHoverCard = () => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<InfoIcon size={24} />
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<ol type="a" className="space-y-3 px-2 py-2 list-[lower-alpha]">
					<li>
						The particulars of any voting rights attached to shares in that
						class, including rights that arise only in certain circumstances
					</li>
					<li>
						The particulars of any rights attached to shares in that class, as
						respects dividends, to participate in a distribution
					</li>
					<li>
						The particulars of any rights attached to shares in that class, as
						respects capital, to participate in a distribution (including on a
						winding up)
					</li>
					<li>Whether or not shares in that class are redeemable shares</li>
				</ol>
			</HoverCardContent>
		</HoverCard>
	);
};
