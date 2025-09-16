"use client";

import { File, Trash } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function FileUpload({ setShow }: { setShow: () => void }) {
	const [files, setFiles] = React.useState<File[]>([]);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (acceptedFiles) => setFiles(acceptedFiles),
		maxFiles: 5,
		maxSize: 10000000,
	});

	const filesList = files.map((file) => (
		<li key={file.name} className="relative">
			<Card className="relative p-4 flex">
				<div className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Remove file"
						onClick={() =>
							setFiles((prevFiles) =>
								prevFiles.filter((prevFile) => prevFile.name !== file.name),
							)
						}
					>
						<Trash className="h-5 w-5 cursor-pointer" aria-hidden={true} />
					</Button>
				</div>
				<CardContent className="!flex-row !justify-start flex items-center space-x-3 p-0">
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
						<File className="h-5 w-5 text-foreground" aria-hidden={true} />
					</span>
					<div>
						<p className="font-medium text-foreground">
							{file.name.length > 30 ? file.name.slice(0, 30) + "..." : file.name}
						</p>
						<p className="mt-0.5 text-sm text-muted-foreground">{file.size} bytes</p>
					</div>
				</CardContent>
			</Card>
		</li>
	));

	return (
		<div className="flex items-center justify-center p-10">
			<Card className="sm:mx-auto sm:max-w-xl">
				<CardHeader>
					<CardTitle>Upload your files</CardTitle>
					<CardDescription className="text-xs">
					When you upload your files, we will analyze them and create a summarized version.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action="#" method="post">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
							<div className="col-span-full">
								<Label htmlFor="file-upload-2" className="font-medium">
									File(s) upload
								</Label>
								<div
									{...getRootProps()}
									className={cn(
										isDragActive
											? "border-primary bg-primary/10 ring-2 ring-primary/20"
											: "border-border",
										"mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200",
									)}
								>
									<div>
										<File
											className="mx-auto h-12 w-12 text-muted-foreground/80"
											aria-hidden={true}
										/>
										<div className="mt-4 flex text-muted-foreground">
											<p>Drag and drop or</p>
											<label
												htmlFor="file"
												className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
											>
												<span>choose file(s)</span>
												<input
													{...getInputProps()}
													id="file-upload-2"
													name="file-upload-2"
													type="file"
													className="sr-only"
												/>
											</label>
											<p className="pl-1">to upload</p>
										</div>
									</div>
								</div>
								<p className="mt-2 text-sm flex flex-col text-muted-foreground">
									<p>All file types are allowed to upload.</p>
									<p>Max Size per file: 10MB</p>
								</p>
								{filesList.length > 0 && (
									<>
										<h4 className="mt-6 font-medium text-foreground">
											File(s) to upload
										</h4>
										<ul role="list" className="mt-4 space-y-4">
											{filesList}
										</ul>
									</>
								)}
							</div>
						</div>
						<Separator className="my-6" />
						<div className="flex items-center justify-end space-x-3">
							<Button
								type="button"
								className="cursor-pointer"
								variant="outline"
								onClick={setShow}
							>
								Cancel
							</Button>
							<Button type="submit" className="cursor-pointer">
								Upload
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
