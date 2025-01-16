import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardProps = {
	title: string;
	icon: JSX.Element;
	stat?: string | number | JSX.Element;
	description: string;
};

const StatsCard = ({ title, icon, stat, description }: StatsCardProps) => {
	return (
		<Card
			x-chunk="dashboard-01-chunk-1"
			className="shadow transition-all hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-gray-400"
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{stat}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
};

export default StatsCard;
