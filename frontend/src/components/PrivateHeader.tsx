"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LucideAsteriskSquare } from "lucide-react";

export default function PrivateHeader() {
	const pathname = usePathname();
	const selected =
		"flex gap-2 items-center text-secondary underline underline-offset-8 decoration-2";
	const normal = "flex gap-2 items-center text-foreground/70 hover:text-foreground";
	const isDashboard = pathname.startsWith("/dashboard");

	return (
		<header className="border-b bg-card flex-shrink-0">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-2">
							<Logo />
							<span className="text-xl font-bold">DocuAI</span>
						</div>
					</div>
					<nav className="flex items-center gap-4">
						<Link href="/dashboard" className={isDashboard ? selected : normal}>
							<LayoutDashboard className="sm:hidden block" size={22} />
							<span className="sm:block hidden">Dashboard</span>
						</Link>
						<Link href="/chat" className={!isDashboard ? selected : normal}>
							<LucideAsteriskSquare className="sm:hidden block" size={22} />
							<span className="sm:block hidden">Assistant</span>
						</Link>
						<Button variant="outline" size="sm" className="cursor-pointer">
							Settings
						</Button>
					</nav>
				</div>
			</div>
		</header>
	);
}
