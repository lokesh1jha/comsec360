"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import { getAccountUserCount } from "@/lib/api/user/users";
import { StatsInfo } from "@/lib/constants";

const CardSet = () => {
	const [stats, setStats] = useState(StatsInfo);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const totalAccountUsers = await getAccountUserCount();
				setStats((prevStats) => [
					{ ...prevStats[0], stat: totalAccountUsers.count },
					{ ...prevStats[1] },
					{ ...prevStats[2] },
				]);
			} catch (error) {
				console.error("Error fetching account user count:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
			{stats.map((item) => (
				<StatsCard key={item.title} {...item} />
			))}
		</div>
	);
};

export default CardSet;
