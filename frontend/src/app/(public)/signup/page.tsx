import Logo from "@/components/Logo";
import SignupForm from "@/components/signup-form";
import Link from "next/link";

export default function SignupPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link href="/" className="flex items-center gap-2 self-center font-medium">
					<div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<Logo />
					</div>
					DocuAI
				</Link>
				<SignupForm />
			</div>
		</div>
	);
}
