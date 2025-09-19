"use client";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth, User } from "@/api_client/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/shadcn-io/spinner";

const formSchema = z.object({
	username: z.string().trim().toLowerCase().min(5).max(15),
	password: z.string().nonempty(),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	const { handleSubmit, register } = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			const res = await axios.post<{ success: boolean; message: string; data: User }>(
				"http://localhost:8008/auth/login",
				{ ...values },
				{ withCredentials: true },
			);
			toast.success(res.data.message);
			const accessToken = res.headers["authorization"].split(" ")[1];
			login(accessToken, res.data.data);
			router.replace("/dashboard");
		} catch (error) {
			toast.error(
				(error as AxiosError<{ message: string }>).response?.data?.message || "Error",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<Link href="/" className="flex flex-col items-center gap-2 font-medium">
							<div className="flex size-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">DocuAI</span>
						</Link>
						<h1 className="text-xl font-bold">Welcome to DocuAI</h1>
						<div className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link href="/signup" className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="john_klif"
								{...register("username")}
								required
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder={"•".repeat(15)}
								{...register("password")}
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							{!loading ? "Login" : <Spinner size={15} variant="ellipsis" />}
						</Button>
					</div>
					<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
						<span className="bg-background text-muted-foreground relative z-10 px-2">
							Or
						</span>
					</div>
					<div className="grid gap-4 sm:grid-cols-1">
						<Button variant="outline" type="button" className="w-full">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
									fill="currentColor"
								/>
							</svg>
							Continue with Google
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
