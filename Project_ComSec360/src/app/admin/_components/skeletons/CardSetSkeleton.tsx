import StatsCard from "@/components/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsInfo } from "@/lib/constants";

const CardSetSkeleton = () => {
	return (
		<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
			{StatsInfo.map((item) => (
				<StatsCard
					key={item.title}
					title={item.title}
					description={item.description}
					stat={<Skeleton className="size-4 mb-2" />}
					icon={item.icon}
				/>
			))}
		</div>
	);
};

export default CardSetSkeleton;
