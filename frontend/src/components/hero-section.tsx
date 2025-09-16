import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Zap, Shield, Globe } from "lucide-react";

export function HeroSection() {
	return (
		<section className="relative py-20 lg:py-32 overflow-hidden">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-4xl mx-auto">
					<Badge
						variant="secondary"
						className="mb-6 bg-primary text-primary-foreground border-primary/20"
					>
						<Zap className="w-3 h-3 mr-1" />
						AI-Powered Document Intelligence
					</Badge>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
						Transform Documents into
						<span className="text-primary"> Actionable Insights</span>
					</h1>

					<p className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto text-pretty">
						DocuAI&apos;s powerful API enables intelligent document search, extraction,
						and analysis. Process any document format with enterprise-grade AI in
						milliseconds.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Button
							size="lg"
							className="bg-primary text-primary-foreground hover:bg-primary/90"
						>
							Start Free Trial
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-border bg-transparent"
						>
							<Play className="mr-2 h-4 w-4" />
							Watch Demo
						</Button>
					</div>

					<div className="flex flex-wrap justify-center gap-8 text-sm text-foreground/70">
						<div className="flex items-center">
							<Shield className="w-4 h-4 mr-2 text-primary" />
							SOC 2 Compliant
						</div>
						<div className="flex items-center">
							<Globe className="w-4 h-4 mr-2 text-primary" />
							99.9% Uptime SLA
						</div>
						<div className="flex items-center">
							<Zap className="w-4 h-4 mr-2 text-primary" />
							Sub-second Response
						</div>
					</div>
				</div>
			</div>

			{/* Background decoration */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl"></div>
			</div>
		</section>
	);
}
