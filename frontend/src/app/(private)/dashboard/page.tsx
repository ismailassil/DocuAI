"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, MessageSquare, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FileUpload from "@/components/file-upload";

export default function Dashboard() {
	const [showUpload, setShowUpload] = useState(false);

	useEffect(() => {
		
		return () => {};
	}, []);

	return (
		<div className="min-h-[calc(100vh-65px)] bg-background">
			{showUpload && (
				<div className="bg-black/30 backdrop-blur-sm size-full absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">
					<div className="size-full flex items-center justify-center">
						<FileUpload setShow={() => setShowUpload(false)} />
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Documents</CardTitle>
							<FileText className="h-4 w-4 text-secondary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">2,847</div>
							<p className="text-xs text-foreground/70">+12% from last month</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">API Calls</CardTitle>
							<BarChart3 className="h-4 w-4 text-secondary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">45,231</div>
							<p className="text-xs text-foreground/70">+8% from last month</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Active Users</CardTitle>
							<Users className="h-4 w-4 text-secondary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">1,234</div>
							<p className="text-xs text-foreground/70">+23% from last month</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Success Rate</CardTitle>
							<TrendingUp className="h-4 w-4 text-secondary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">98.5%</div>
							<p className="text-xs text-foreground/70">+0.3% from last month</p>
						</CardContent>
					</Card>
				</div>

				{/* Recent Activity & Quick Actions */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Activity */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest document processing activities</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 bg-secondary rounded-full"></div>
								<div className="flex-1">
									<p className="text-sm font-medium">
										Financial Report Q3 processed
									</p>
									<p className="text-xs text-foreground/70">2 minutes ago</p>
								</div>
								<Badge variant="secondary">Success</Badge>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 bg-secondary rounded-full"></div>
								<div className="flex-1">
									<p className="text-sm font-medium">
										Contract Analysis completed
									</p>
									<p className="text-xs text-foreground/70">15 minutes ago</p>
								</div>
								<Badge variant="secondary">Success</Badge>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 bg-secondary rounded-full"></div>
								<div className="flex-1">
									<p className="text-sm font-medium">Research Paper indexed</p>
									<p className="text-xs text-foreground/70">1 hour ago</p>
								</div>
								<Badge variant="secondary">Success</Badge>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 bg-secondary rounded-full"></div>
								<div className="flex-1">
									<p className="text-sm font-medium">Legal Document extracted</p>
									<p className="text-xs text-foreground/70">3 hours ago</p>
								</div>
								<Badge variant="secondary">Success</Badge>
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common tasks and shortcuts</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Link href="/chat">
								<Button
									className="w-full justify-start bg-transparent cursor-pointer"
									variant="outline"
								>
									<MessageSquare className="mr-2 h-4 w-4" />
									Start Chat Assistant
								</Button>
							</Link>
							<Button
								className="w-full justify-start bg-transparent cursor-pointer"
								variant="outline"
								onClick={() => setShowUpload(true)}
							>
								<FileText className="mr-2 h-4 w-4" />
								Upload New Document
							</Button>
							<Button
								className="w-full justify-start bg-transparent cursor-pointer"
								variant="outline"
							>
								<BarChart3 className="mr-2 h-4 w-4" />
								View Analytics
							</Button>
							<Button
								className="w-full justify-start bg-transparent cursor-pointer"
								variant="outline"
							>
								<Users className="mr-2 h-4 w-4" />
								Manage Team
							</Button>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
