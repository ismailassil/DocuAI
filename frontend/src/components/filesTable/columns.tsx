"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import moment from "moment";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DataTableRowDownload from "./DataTableRowDownload";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
	id: number;
	filename: string;
	createdAt: Date;
	isSummarized: "Success" | "Failed";
};

interface FilesColumnsProps {
	onDownload: (value: number) => Promise<void>;
}

export const columns = ({ onDownload }: FilesColumnsProps): ColumnDef<File>[] => [
	{
		accessorKey: "isSummarized",
		header: () => <div className="text-center">Summary</div>,
		cell: ({ row }) => {
			const value = row.getValue("isSummarized") as File["isSummarized"];
			const isSuccess = value === "Success";

			return (
				<div className="flex justify-center">
					<Badge variant={isSuccess ? "secondary" : "destructive"} className="w-17">
						{value}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: "filename",
		header: "Name",
		cell: ({ row }) => {
			const length = 40;
			const value = row.getValue("filename") as string;
			const isLong = value.length > length;

			return <div>{isLong ? value.slice(0, length) + "..." : value}</div>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Date Created",
		cell: ({ row }) => {
			const value = row.getValue("createdAt") as Date;
			const formatedDate = moment.utc(value).local().add(1, "hour").fromNow();
			const date = moment.utc(value).format("dd, MMM Do YYYY | hh:mm A");

			return (
				<Tooltip>
					<TooltipTrigger>{date}</TooltipTrigger>
					<TooltipContent>
						<p>{formatedDate}</p>
					</TooltipContent>
				</Tooltip>
			);
		},
	},
	{
		accessorKey: "id",
		header: () => <div className="text-center">Download Link</div>,
		cell: ({ row }) => <DataTableRowDownload row={row} onDownload={onDownload} />,
	},
];
