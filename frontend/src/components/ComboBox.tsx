"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { File } from "@/lib/File";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuth } from "@/api_client/AuthContext";

interface Props {
	setValueId: (value: number) => void;
}

export function ComboBox({ setValueId }: Props) {
	const { axiosPrivate } = useAuth();
	const [files, setFiles] = React.useState<File[]>([]);
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const [search, setSearch] = React.useState("");

	const getRecentFiles = React.useCallback(async () => {
		try {
			const res = await axiosPrivate.get<{
				originalFiles: File[];
				summarizedFiles: File[];
			}>("/user/recent-files");
			console.log(res.data);
			toast.info("Files Found");
			setFiles(res.data.originalFiles);
		} catch (error) {
			toast.error((error as AxiosError<{ message: string }>).response?.data.message);
			console.log(error);
		}
	}, [axiosPrivate]);

	const searchFile = React.useCallback(
		async (value: string) => {
			value = value.trim();
			if (value.length <= 2) return;

			try {
				const res = await axiosPrivate.get("/user/search", {
					params: {
						value,
					},
				});

				toast.info("File Found::" + value);
				setFiles(res.data);
			} catch (error) {
				toast.error("File NOT Found::" + value);
				console.log((error as AxiosError<{ message: string }>).response?.data.message);
			}
		},
		[axiosPrivate],
	);

	React.useEffect(() => {
		if (search.length === 0) getRecentFiles();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-fit min-w-[200px] justify-between"
				>
					{!value ? "Choose file..." : value}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit min-w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder="Search for file..."
						onValueChange={(search) => {
							setSearch(search);
							searchFile(search);
						}}
					/>
					<CommandList>
						<CommandEmpty>No Files Found.</CommandEmpty>
						<CommandGroup>
							{files &&
								files.map((file) => (
									<CommandItem
										key={file.id}
										value={file.filename}
										onSelect={(currentValue) => {
											toast.info(currentValue);
											setValue(currentValue === value ? "" : currentValue);
											setValueId(currentValue === value ? -1 : file.id);
											setOpen(false);
										}}
									>
										<CheckIcon
											className={cn(
												"mr-2 h-4 w-4",
												value === file.filename
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										{file.filename}
									</CommandItem>
								))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
