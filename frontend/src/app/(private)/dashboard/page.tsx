"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, ChevronRight, Files } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import FileUpload from "@/components/file-upload";
import { useAuth } from "@/api_client/AuthContext";
import { toast } from "sonner";
import { AxiosError } from "axios";
import moment from "moment";
import contentDisposition from "content-disposition";
import { DataTable } from "@/components/filesTable/data-table";
import { columns } from "@/components/filesTable/columns";
import { File } from "@/lib/File";
import FileCard from "@/components/FileCard";
import FileViewer from "@/components/fileViewer";

export class TableFile {
	id: number;
	filename: string;
	createdAt: Date;
	isSummarized: "Success" | "Failed";
	isProcessed: boolean;
	reason?: string;

	constructor(file: File) {
		this.id = file.is_summarized === true ? file.id : -1;
		this.filename = file.filename;
		this.createdAt = file.createdAt;
		this.isSummarized = file.is_summarized === true ? "Success" : "Failed";
		this.isProcessed = file.is_processing;
		this.reason = file.reason;
	}
}

export default function Dashboard() {
	const [currentPage, setCurrentPage] = useState(1);
	const [files, setFiles] = useState<File[] | null>(null);
	const [showUpload, setShowUpload] = useState(false);
	const [allFiles, setAllFiles] = useState<TableFile[]>([]);
	const { axiosPrivate } = useAuth();
	const [showFile, setShowFile] = useState(false);
	const [content, setContent] = useState<{
		title: string;
		data: string;
	} | null>(null);

	const getRecentFiles = useCallback(async () => {
		try {
			const res = await axiosPrivate.get<File[]>("/user/recent-files");
			toast.info("Files Found");
			console.log(res.data);
			setFiles(res.data);
		} catch (error) {
			toast.error((error as AxiosError<{ message: string }>).response?.data.message);
			console.log(error);
		}
	}, [axiosPrivate]);

	const getAllFiles = useCallback(
		async (inputPage: number) => {
			let n_page = currentPage;

			if (inputPage === 0) {
				n_page = 1;
			} else if (inputPage === 1) {
				n_page++;
			} else if (inputPage === -1) {
				n_page--;
			} else {
				return;
			}

			if (n_page <= 0) return;

			try {
				const res = await axiosPrivate.get<{ files: File[] }>("/user/files", {
					params: {
						page: n_page,
					},
				});

				setAllFiles(res.data.files.map((file) => new TableFile(file)));
				setCurrentPage(n_page);
				toast.info("All Files FOUND");
			} catch (error) {
				toast.error("All Files Not found");
				console.log(error);
			}
		},
		[axiosPrivate, currentPage],
	);

	useEffect(() => {
		getRecentFiles();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		getAllFiles(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFileDownload = useCallback(
		async (id: number) => {
			try {
				const res = await axiosPrivate.get("/user/file/" + id);

				const disposition = res.headers["content-disposition"];
				const parsed = contentDisposition.parse(disposition);

				const url = window.URL.createObjectURL(new Blob([res.data]));
				const linkAnchor = document.createElement("a");

				linkAnchor.href = url;
				linkAnchor.setAttribute("download", parsed?.parameters?.filename || "filename");
				document.body.appendChild(linkAnchor);

				linkAnchor.click();
				linkAnchor.remove();
				window.URL.revokeObjectURL(url);

				toast.info("Downloading Successfull");
			} catch (error) {
				toast.error("Error while Downloading");
				console.error(error);
			}
		},
		[axiosPrivate],
	);

	async function handleSummarizedFile(file: File) {
		if (!file.is_summarized) return;

		const { id } = file;
		try {
			const res = await axiosPrivate.get("/user/file/" + id);

			const disposition = res.headers["content-disposition"];
			const parsed = contentDisposition.parse(disposition);

			const url = window.URL.createObjectURL(new Blob([res.data]));
			const linkAnchor = document.createElement("a");

			linkAnchor.href = url;
			linkAnchor.setAttribute("download", parsed?.parameters?.filename || "filename");
			document.body.appendChild(linkAnchor);

			linkAnchor.click();
			linkAnchor.remove();
			window.URL.revokeObjectURL(url);

			toast.info("Downloading Successfull");
		} catch (error) {
			toast.error("Error while Downloading");
			console.error(error);
		}
	}

	async function handleReadFile(file: File) {
		if (!file.is_summarized) return;

		try {
			const res = await axiosPrivate.get<{ filename: string; content: string }>(
				"/user/file-content",
				{
					params: {
						id: file.id,
					},
				},
			);

			toast.success("File Content Success");
			console.log(res.data);
			setContent({ title: res.data.filename, data: res.data.content });
			setShowFile(true);
		} catch (error) {
			toast.error("File Content Not found");
			console.log((error as Error).message);
		}
	}

	return (
		<div className="min-h-[calc(100vh-65px)] bg-background">
			{showFile && (
				<FileViewer
					title={content?.title || ""}
					text={content?.data || ""}
					onClose={() => {
						setShowFile(false);
						setContent(null);
					}}
				/>
			)}

			{showUpload && (
				<div className="bg-black/30 absolute backdrop-blur-sm size-full top-1/2 z-10 -translate-x-1/2 left-1/2 -translate-y-1/2">
					<div className="size-full flex items-center justify-center">
						<FileUpload
							setShow={() => setShowUpload(false)}
							refreshRecentFiles={() => {
								getRecentFiles();
								getAllFiles(currentPage - 1);
							}}
						/>
					</div>
				</div>
			)}

			<main className="container mx-auto px-4 py-8">
				{/* Welcome Section */}
				<div className="mb-8 space-y-2">
					<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
						Welcome back!
					</h1>
					<p className="text-muted-foreground/70 text-xl">
						Here&apos;s what&apos;s happening with your documents today.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
					<Card
						className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
						onClick={() => setShowUpload(true)}
					>
						<CardHeader className="w-full -space-y-1 pb-2">
							<CardTitle className="text-md font-medium">Upload Documents</CardTitle>
							<div className="text-xs font-light">Add files for AI processing.</div>
						</CardHeader>
						<CardContent className="!flex-row w-full">
							<Files className="size-8 text-white" />
							<ChevronRight className="size-8 text-white" />
						</CardContent>
					</Card>
					<Link href="/chat">
						<Card className="cursor-pointer hover:bg-gray-50">
							<CardHeader className="w-full -space-y-1 pb-2">
								<CardTitle className="text-md font-medium">
									Chat Assistant
								</CardTitle>
								<div className="text-xs font-light">
									AI-powered chat management.
								</div>
							</CardHeader>
							<CardContent className="!flex-row w-full">
								<Bot className="size-8 text-secondary" />
								<ChevronRight className="size-8 text-secondary" />
							</CardContent>
						</Card>
					</Link>
				</div>

				{/* Recent Activity & Quick Actions */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Activity */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest document processing activities</CardDescription>
						</CardHeader>
						{!files || files.length === 0 ? (
							<CardContent className="space-y-4 size-full">
								<div className="flex items-center h-25 justify-center">
									<div className="text-center space-y-1 text-sm text-muted-foreground">
										<Files size={20} className="inline-block" />
										<p>No files Found</p>
									</div>
								</div>
							</CardContent>
						) : (
							<CardContent className="space-y-4">
								{files.map((file) => (
									<div key={file.id} className="flex items-center gap-3">
										<div className="w-1 h-full bg-secondary rounded-full"></div>
										<div className="flex-1">
											<p className="text-sm font-medium">
												{file?.filename?.length > 40
													? file.filename.slice(0, 40) + "..."
													: file.filename}
											</p>
											<p className="text-xs text-foreground/70">
												{moment
													.utc(file.createdAt)
													.local()
													.add(1, "hour")
													.fromNow()}
											</p>
										</div>
										<Badge variant="secondary">Success</Badge>
									</div>
								))}
							</CardContent>
						)}
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Recent Summarized files</CardTitle>
							<CardDescription>Latest document processed by AI</CardDescription>
						</CardHeader>
						{!files || files?.length === 0 ? (
							<CardContent className="space-y-4 size-full">
								<div className="flex items-center h-25 justify-center">
									<div className="text-center space-y-1 text-sm text-muted-foreground">
										<Files size={20} className="inline-block" />
										<p>No files Found</p>
									</div>
								</div>
							</CardContent>
						) : (
							<CardContent className="space-y-4">
								{files.map((file) => (
									<FileCard
										key={file.id}
										file={file}
										handleClick={handleSummarizedFile}
										handleRead={handleReadFile}
									/>
								))}
							</CardContent>
						)}
					</Card>
				</div>
				<div className="container mx-auto pt-10 space-y-2">
					<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						Document Upload History
					</h2>
					<DataTable
						columns={columns({ onDownload: handleFileDownload })}
						data={allFiles}
						page={currentPage}
						onPagination={getAllFiles}
					/>
				</div>
			</main>
		</div>
	);
}
