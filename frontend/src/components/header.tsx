import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="flex items-center justify-center w-8 h-8 rounded-lg">
							<Logo />
						</div>
						<span className="text-xl font-bold text-foreground">DocuAI</span>
					</div>

					<div className="flex items-center space-x-4">
						<Link href="/login">
							<Button
								variant="ghost"
								size="sm"
								className="hidden md:inline-flex cursor-pointer"
							>
								Sign In
							</Button>
						</Link>
						<Link href="/signup">
							<Button
								size="sm"
								className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
							>
								Get Started
							</Button>
						</Link>
						<Button variant="ghost" size="sm" className="md:hidden">
							<Menu className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
