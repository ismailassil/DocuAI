"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import moment from "moment";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DataTableRowDownload from "./DataTableRowDownload";
import { Info } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
	id: number;
	filename: string;
	createdAt: Date;
	isSummarized: "Success" | "Failed";
	isProcessed: boolean;
	reason?: string;
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
			const reason = row.original.reason as string;
			const isProcessed = row.original.isProcessed as boolean;
			const text = (isProcessed && "Handling") || value;

			return (
				<div className="flex justify-center">
					<Tooltip>
						<TooltipTrigger>
							<Badge
								variant={
									(isProcessed && "outline") ||
									(value === "Success" ? "secondary" : "destructive")
								}
								className="w-17"
							>
								{text}
							</Badge>
						</TooltipTrigger>
						{value === "Failed" && (
							<TooltipContent className="max-w-70 py-2 space-y-2">
								<p className="font-bold mt-1 flex items-center gap-2">
									<Info size={18} /> Error
								</p>
								<p>{reason}</p>
							</TooltipContent>
						)}
					</Tooltip>
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
