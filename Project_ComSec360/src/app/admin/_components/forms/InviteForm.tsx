import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AccountUserForm } from "./AccountUserForm";

export function InviteForm() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Invite an Account User</CardTitle>
				<CardDescription>
					Fill in the information to invite Account User
				</CardDescription>
			</CardHeader>
			<CardContent>
				<AccountUserForm />
			</CardContent>
		</Card>
	);
}
