"use client";

import { ShareholdersFormSchema } from "@/app/validationSchemas";
import { TooltipComponent } from "@/components/Tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as RPNInput from "react-phone-number-input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDataContext } from "@/context/ContextProvider";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { PhoneInput } from "../ui/phone-input";
import { useShareCapitalStore } from "@/store/shareCapitalDataStore";
import { addSharedHolderData } from "@/lib/api/shareHolder";
import { toast } from "../ui/use-toast";
import { uploadFileProof } from "@/lib/api/shareHolder";
import { useShareHolderStore } from "@/store/shareHolderDataStore";

const Shareholders = () => {
	const [disable, setDisable] = useState(false);
	const { setTabValue, setDisableDirectors, companyId } = useDataContext();
	const [idProof, setIdProof] = useState<String | null>(null);
	const [addressProof, setAddressProof] = useState<String | null>(null);

	const shareCapitalData = useShareCapitalStore(
		(state) => state.shareCapitalData,
	);

	useEffect(() => {
		console.log("shareCapitalData", shareCapitalData);
	}, [shareCapitalData]);


	// upload company logo image
	const handleIdProofUpload = async (file: File) => {
		try {
			const response = await uploadFileProof(file, companyId, "idProof");
			console.log("lcoaltion", response.data.location);
			if (response.data.location) {
				toast({
					title: "Success",
					description: "File uploaded successfully",
					variant: "default",
				})
				setIdProof(response.data.location);
			}
		} catch (error) {
			console.log(error);
			toast({
				title: "Error",
				description: "File upload failed",
				variant: "destructive",
			})
		}
	};


	const handleAddressProofUpload = async (file: File) => {
		try {
			console.log("file");
			const response = await uploadFileProof(file, companyId, "addressProof");
			console.log("lcoaltion", response.data);
			if (response.data.location) {
				toast({
					title: "Success",
					description: "File uploaded successfully",
					variant: "default",
				})
				setAddressProof(response.data.location);
			}
		} catch (error) {
			console.log(error);
			toast({
				title: "Error",
				description: "File upload failed",
				variant: "destructive",
			})
		}
	}




	const form = useForm<z.infer<typeof ShareholdersFormSchema>>({
		resolver: zodResolver(ShareholdersFormSchema),
		defaultValues: {
			type: "person",
			surname: "",
			name: "",
			idNo: "",
			address: "",
			email: "",
			phone: "",
			idProof: undefined,
			addressProof: undefined,
			shareDetails: [
				{
					classOfShares: "Ordinary",
					noOfShares: 0,
				},
			],
		},
	});
	const IDFileRef = form.register("idProof", { required: true });
	const AddressFileRef = form.register("addressProof", { required: false });
	const control = form.control;
	const { fields, append, remove } = useFieldArray({
		name: "shareDetails",
		control,
	});

	const shareholdersRows = [
		{
			label: "Person/Company",
			for: "type",
		},
		{
			label: "Surname",
			for: "surname",
		},
		{
			label: "Name",
			for: "name",
		},
		{
			label: disable
				? "Company No. / Upload a Copy"
				: "ID/Passport No. / Upload a Copy",
			for: "idNo",
		},
		{
			label: disable ? "Address" : "Address / Upload a Copy",
			for: "address",
		},
		{
			label: "Email",
			for: "email",
		},
		{
			label: "Phone",
			for: "phone",
		},
	];

	// Submit Handler.
	async function onSubmit(values: any) {
		// console.log("values-----------------", values);

		if (idProof) {
			values.idProof = idProof;
		} else {
			toast({
				title: "Error",
				description: "Please upload ID proof",
				variant: "destructive",
			})
			return
		}
		console.log("addressProof", values.addressProof);
		if (addressProof) {
			values.addressProof = addressProof;
		}
		values.shareDetails = values.shareDetails.map((detail: any) => {
			const [classOfShares] = detail.classOfShares.split(":::");
			return {
				...detail,
				classOfShares,
			};
		});
		const response = await addSharedHolderData(values, companyId);

		if (!response.success) {
			toast({
				title: "Error",
				description: response.message,
				variant: "destructive",
			})
			return
		}
		else {
			toast({
				title: "Success!!",
				variant: "default",
				description: "Share Holder has been Updated Successfully!!",
			});
		}
		setDisableDirectors(false);
		setTabValue("D");
	}

	const type = form.getValues("type");
	useEffect(() => {
		if (type === "company") {
			setDisable(true);
		} else {
			setDisable(false);
		}
	}, [type]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Shareholders</CardTitle>
				<CardDescription>
					Please enter information on Shareholders
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
						<Table>
							<TableHeader>
								<TableRow>
									{shareholdersRows.slice(0, 4).map((row) => (
										<TableHead
											key={row.for}
											className={cn({
												hidden: disable && row.label === "Surname",
											})}
										>
											<FormLabel htmlFor={row.for}>{row.label}</FormLabel>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>
										<FormField
											name="type"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex justify-start items-center gap-10"
														>
															<FormItem className="flex items-center space-x-3 space-y-0">
																<FormControl>
																	<RadioGroupItem value="person" />
																</FormControl>
																<FormLabel className="font-normal">
																	Person
																</FormLabel>
															</FormItem>
															<FormItem className="flex items-center space-x-3 space-y-0">
																<FormControl>
																	<RadioGroupItem value="company" />
																</FormControl>
																<Label className="font-normal">Company</Label>
															</FormItem>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TableCell>
									<TableCell
										className={cn({
											hidden: disable,
										})}
									>
										<FormField
											name="surname"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															placeholder="Surname Eg: Bond"
															{...form.register("surname")}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TableCell>
									<TableCell>
										<FormField
											name="name"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input placeholder="Name Eg: James" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TableCell>
									<TableCell className="space-y-6">
										<FormField
											name="idNo"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															placeholder={`${disable ? "Company" : "ID"
																} No. Eg: S313XX31X`}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											name="idProof"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															type="File"
															placeholder="Upload a Copy"
															{...IDFileRef}
															onChange={(e) => {
																const file = e.target.files?.[0];
																if (file) {
																	handleIdProofUpload(file);
																}
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
						<Table>
							<TableHeader>
								<TableRow>
									{shareholdersRows.slice(4, 9).map((row) => (
										<TableHead key={row.for}>
											<FormLabel
												htmlFor={row.for}
												className={cn({
													"inline-flex items-center gap-3":
														!disable && row.label === "Address",
												})}
											>
												{row.label}
												{!disable && row.label === "Address" && (
													<TooltipComponent content="Address proof can be a bank letter or utility letter with the name and the address." />
												)}
											</FormLabel>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="space-y-6">
										<FormField
											name="address"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															placeholder="Name Eg: No.1 Jianguomenwai Avenue"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{!disable && (
											<FormField
												name="addressProof"
												control={form.control}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																type="File"
																placeholder="Upload a Copy"
																{...AddressFileRef}
																{...AddressFileRef}
																onChange={(e) => {
																	const file = e.target.files?.[0];
																	if (file) {
																		handleAddressProofUpload(file);
																	}
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
									</TableCell>
									<TableCell>
										<FormField
											name="email"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															type="email"
															placeholder="Eg: email1@gmail.com"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TableCell>
									<TableCell>
										<FormField
											name="phone"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<PhoneInput
															placeholder="Enter a phone number"
															defaultCountry="HK"
															value={(field.value || "") as "" | RPNInput.Value} // Transform value to match expected type
															onChange={(value) => field.onChange(value || "")} // Handle onChange safely
															onBlur={field.onBlur} // Pass onBlur if needed
															name={field.name} // Pass name if needed
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Class of Shares</TableHead>
									<TableHead>No. of Shares</TableHead>
									<TableHead>Action</TableHead>
									<TableHead>
										{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
										<span
											className={buttonVariants()}
											onClick={() =>
												append({
													classOfShares: "",
													noOfShares: 0,
												})
											}
										>
											<PlusCircle />
										</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{fields.map((item, index) => (
									<TableRow key={item.id}>
										<TableCell>
											<FormItem>
												<FormControl>
													<Controller
														name={`shareDetails.${index}.classOfShares`}
														control={control}
														defaultValue="" // Ensure no default selection
														render={({ field }) => (
															<Select
																onValueChange={field.onChange}
																value={field.value || ""} // Use an empty string if no value is selected
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder="Class of Shares" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectGroup>
																		{shareCapitalData &&
																			shareCapitalData.map((shareItem) => (
																				<SelectItem
																					key={shareItem.id}
																					value={`${shareItem.class}:::${shareItem.id}`} // Use a unique value for each item
																				>
																					{/* @ts-expect-error */}
																					{shareItem.class} {shareCapitalData?.shareTypeMap ? shareCapitalData?.shareTypeMap[shareItem.class] : ""}
																				</SelectItem>
																			))}
																	</SelectGroup>
																</SelectContent>
															</Select>
														)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										</TableCell>
										<Controller
											name={`shareDetails.${index}.noOfShares`}
											control={control}
											render={({ field }) => (
												<TableCell>
													<Input
														{...field}
														type="number"
														onChange={(e) => {
															const value = parseInt(e.target.value, 10);
															if (value <= 300 || value == null || isNaN(value)) {
																field.onChange(value);
															} else {
																field.onChange(300);
															}
														}}
													/>
												</TableCell>
											)}
										/>
										<TableCell>
											<Button
												type="button"
												variant="destructive"
												onClick={() => remove(index)}
											>
												<Trash2 />
											</Button>
										</TableCell>
									</TableRow>
								))}

							</TableBody>
						</Table>
						<div>
							<Button type="submit" className="my-4">
								Add Shareholder
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default Shareholders;
