import { Row } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { Spinner } from "../ui/shadcn-io/spinner";
import { File } from "./columns";

interface DataTableRowDownloadProps<TData> {
	row: Row<TData>;
	onDownload: (id: number) => Promise<void>;
}

const DataTableRowDownload = <TData,>({ row, onDownload }: DataTableRowDownloadProps<TData>) => {
	const fileId = row.getValue("id") as number;
	const isProcessed = (row.original as File).isProcessed as boolean;

	return (
		<div className="w-full flex justify-center">
			{(isProcessed && <Spinner size={18} />) ||
				(fileId !== -1 && (
					<Download
						size={18}
						className="cursor-pointer hover:text-secondary"
						onClick={() => onDownload(fileId)}
					/>
				))}
		</div>
	);
};

export default DataTableRowDownload;
