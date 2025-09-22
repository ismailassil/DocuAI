import { Row } from "@tanstack/react-table";
import { Download } from "lucide-react";

interface DataTableRowDownloadProps<TData> {
	row: Row<TData>;
	onDownload: (id: number) => Promise<void>;
}

const DataTableRowDownload = <TData,>({ row, onDownload }: DataTableRowDownloadProps<TData>) => {
	const fileId = row.getValue("id") as number;

	return (
		<div className="w-full flex justify-center">
			{fileId !== -1 && (
				<Download
					size={18}
					className="cursor-pointer hover:text-secondary"
					onClick={() => onDownload(fileId)}
				/>
			)}
		</div>
	);
};

export default DataTableRowDownload;
