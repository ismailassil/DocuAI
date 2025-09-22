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

export interface File {
	id: number;
	filename: string;
	createdAt: Date;
	is_summarized: boolean;
}

export default function Dashboard() {
	const [orgFiles, setOrgFiles] = useState<File[] | null>(null);
	const [sumFiles, setSumFiles] = useState<File[] | null>(null);
	const [showUpload, setShowUpload] = useState(false);
	const { axiosPrivate } = useAuth();

	const getRecentFiles = useCallback(async () => {
		try {
			const res = await axiosPrivate.get<{
				originalFiles: File[];
				summarizedFiles: File[];
			}>("/user/recent-files");
			console.log(res.data);
			toast.info("Files Found");
			setOrgFiles(res.data.originalFiles);
			setSumFiles(res.data.summarizedFiles);
		} catch (error) {
			toast.error((error as AxiosError<{ message: string }>).response?.data.message);
			console.log(error);
		}
	}, [axiosPrivate]);

	useEffect(() => {
		getRecentFiles();
	}, [axiosPrivate, getRecentFiles]);

	async function handleDownload(file: File) {
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

	return (
		<div className="min-h-[calc(100vh-65px)] bg-background">
			{showUpload && (
				<div className="bg-black/30 absolute backdrop-blur-sm h-screen w-full top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">
					<div className="size-full flex items-center justify-center">
						<FileUpload
							setShow={() => setShowUpload(false)}
							refreshRecentFiles={getRecentFiles}
						/>
					</div>
				</div>
			)}

			<main className="container mx-auto px-4 py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
					<p className="text-foreground/70">
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
						{!orgFiles || orgFiles.length === 0 ? (
							<CardContent className="space-y-4 size-full h-50">
								<div className="h-full flex items-center justify-center">
									<div className="text-center space-y-2 text-muted-foreground">
										<Files className="inline-block" />
										<p>No files Found</p>
									</div>
								</div>
							</CardContent>
						) : (
							<CardContent className="space-y-4">
								{orgFiles.map((file) => (
									<div key={file.id} className="flex items-center gap-3">
										<div className="w-1 h-full bg-secondary rounded-full"></div>
										<div className="flex-1">
											<p className="text-sm font-medium">
												{file.filename.length > 40
													? file.filename.slice(0, 40) + "..."
													: file.filename}
											</p>
											<p className="text-xs text-foreground/70">
												{moment(file.createdAt).fromNow()}
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
						{!sumFiles || sumFiles?.length === 0 ? (
							<CardContent className="space-y-4 size-full">
								<div className="h-full flex items-center justify-center">
									<div className="text-center space-y-2 text-muted-foreground">
										<Files className="inline-block" />
										<p>No files Found</p>
									</div>
								</div>
							</CardContent>
						) : (
							<CardContent className="space-y-4">
								{sumFiles.map((file) => (
									<div key={file.id} className="flex items-center gap-3">
										<div className="flex-1">
											<p className="text-sm font-medium">
												{file.filename.length > 40
													? file.filename.slice(0, 40) + "..."
													: file.filename}
											</p>
											<p className="text-xs text-foreground/70">
												{moment.utc(file.createdAt).fromNow()}
											</p>
										</div>
										<div className="flex flex-col gap-1">
											<Badge
												variant={
													file.is_summarized ? "secondary" : "destructive"
												}
												className="w-full"
											>
												{file.is_summarized ? "Success" : "Failed"}
											</Badge>
											<Badge
												variant="secondary"
												className={`${
													!file.is_summarized
														? "pointer-events-none bg-gray-100 text-gray-400 cursor-not-allowed"
														: "cursor-pointer bg-white text-black"
												} w-full  hover:bg-gray-100 border-1 border-black/20`}
												onClick={() => handleDownload(file)}
											>
												Download
											</Badge>
										</div>
									</div>
								))}
							</CardContent>
						)}
					</Card>
				</div>
			</main>
		</div>
	);
}
