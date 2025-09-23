import { File } from "@/lib/File";
import { Badge } from "./ui/badge";
import moment from "moment";
import { Spinner } from "./ui/shadcn-io/spinner";
import { Eye } from "lucide-react";

interface Props {
	file: File;
	handleClick: (file: File) => Promise<void>;
}

export default function FileCard({ file, handleClick }: Props) {
	const { id, filename, createdAt, is_summarized } = file;

	const is_processing = true;

	return (
		<div key={id} className={`flex items-center gap-3 `}>
			<div className="flex flex-col gap-1 relative">
				<Badge variant={"outline"} className="h-full">
					Summary
				</Badge>
				<Badge
					variant={"outline"}
					className="h-full w-full hover:scale-105 duration-200 transition-all cursor-pointer"
				>
					<Eye className="w-full" />
				</Badge>
				{is_processing && (
					<div className="absolute z-2 bg-white/70 ring-1 ring-offset-2 ring-gray-100 rounded-md h-full w-full ">
						<div className="flex items-center justify-center size-full">
							<Spinner color="blue" variant="infinite" />
						</div>
					</div>
				)}
			</div>
			<div className="flex-1">
				<p className="text-sm font-medium">
					{filename.length > 40 ? filename.slice(0, 40) + "..." : filename}
				</p>
				<p className="text-xs text-foreground/70">
					{moment.utc(createdAt).local().add(1, "hour").fromNow()}
				</p>
			</div>
			<div className="flex flex-col gap-1">
				<Badge
					variant={
						(is_processing && "outline") ||
						(is_summarized ? "secondary" : "destructive")
					}
					className="w-full"
				>
					{(is_processing && "Handling") || (is_summarized ? "Success" : "Failed")}
				</Badge>
				<Badge
					variant="outline"
					className={`${
						!is_summarized || is_processing
							? "pointer-events-none bg-gray-100 text-gray-400 cursor-not-allowed"
							: "cursor-pointer"
					} w-full`}
					onClick={() => handleClick(file)}
				>
					Download
				</Badge>
			</div>
		</div>
	);
}
