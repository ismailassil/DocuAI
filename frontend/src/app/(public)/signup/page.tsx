import SignUpForm from "@/components/signup-form";

export default function Home() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-2">
					<h1 className="text-3xl font-bold text-foreground">Create Account</h1>
					<p className="text-muted-foreground mt-2">Sign Up to Get Started</p>
				</div>
				<SignUpForm />
			</div>
		</div>
	);
}
