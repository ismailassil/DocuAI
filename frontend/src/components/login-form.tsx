"use client";
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
import Logo from "./Logo";
import GoogleAuth from "./google-auth";

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
					<div className="flex flex-col text-2xl items-center gap-2">
						<Link href="/" className="flex flex-col items-center gap-2 font-medium">
							<div className="flex size-8 items-center justify-center rounded-md">
								<Logo size={30} />
							</div>
							<span className="sr-only">DocuAI</span>
						</Link>
						<h1 className="text-2xl font-bold">Welcome to DocuAI</h1>
					</div>
					<GoogleAuth setLoading={setLoading} text="Continue with Google" />
					<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
						<span className="bg-background text-muted-foreground relative z-10 px-2">
							OR
						</span>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="johndoe"
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
					<div className="text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="underline underline-offset-4">
							Sign Up
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
