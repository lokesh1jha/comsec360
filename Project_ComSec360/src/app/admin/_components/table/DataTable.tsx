'use client';
import { listAccountUser } from "@/lib/api/user/users";
import InviteTable from "./InviteTable";
import { useEffect, useState } from "react";

type AccountUsersTypes = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};


const DataTable =  () => {
	// let data: AccountUsersTypes[] = await listAccountUser();
	const [data, setData] = useState<AccountUsersTypes[]>([]);
	useEffect(() => {
		(async () => {
			const data = await listAccountUser();
			setData(data);
		})()

	}, [])
	return <InviteTable data={data} />;
};

export default DataTable;
