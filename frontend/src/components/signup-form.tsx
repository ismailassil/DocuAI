"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/shadcn-io/spinner";
import { useAuth } from "@/api_client/AuthContext";
import { useForm } from "react-hook-form";
import api from "@/api_client/APIClient";

const formSchema = z.object({
	username: z
		.string()
		.trim()
		.toLowerCase()
		.min(5, {
			message: "Must be at least 5 characters.",
		})
		.max(15, {
			error: "Must be at most 15 characters.",
		}),

	firstName: z
		.string()
		.trim()
		.min(3, {
			error: "Must be at least 3 characters.",
		})
		.max(15, {
			error: "Must be at most 15 characters.",
		}),

	lastName: z
		.string()
		.trim()
		.min(3, {
			error: "Must be at least 3 characters.",
		})
		.max(15, {
			error: "Must be at most 15 characters.",
		}),

	email: z
		.email({
			error: "Invalid email address.",
		})
		.trim()
		.toLowerCase(),
	password: z
		.string()
		.min(8, {
			error: "Must be at least 8 characters.",
		})
		.max(25, {
			error: "Must not exceed 25 characters.",
		})
		.refine((val) => /[a-z]/.test(val), {
			error: "Must contain at least one lowercase character.",
		})
		.refine((val) => /[A-Z]/.test(val), {
			error: "Must contain at least one uppercase character.",
		})
		.refine((val) => /[0-9]/.test(val), {
			error: "Must contain at least one digit.",
		})
		.refine((val) => /[^A-Za-z0-9]/.test(val), {
			error: "Must contain at least one special character.",
		}),
});

export default function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		}
		return () => {};
	}, [isAuthenticated, router]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			const res = await axios.post<{ success: boolean; message: string }>(
				"http://localhost:8008/auth/register",
				{ ...values },
				{ withCredentials: true },
			);
			toast.success(res.data.message);
			const accessToken = res.headers["authorization"].split(" ")[1];
			api.setAccessToken(accessToken);
			setIsAuthenticated(true);
			setUser({
				username: values.username,
				email: values.email,
			});
			router.push("/dashboard");
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
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create your account</CardTitle>
					<CardDescription>Sign up with your Google account</CardDescription>
				</CardHeader>
				<CardContent>
					<form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-6">
							<div className="flex flex-col gap-4">
								<Button
									variant="outline"
									className="w-full cursor-pointer bg-transparent"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Sign up with Google
								</Button>
							</div>
							<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
								<span className="bg-card text-muted-foreground relative z-10 px-2">
									Or continue with
								</span>
							</div>
							<div className="grid gap-6">
								<div className="grid gap-3">
									<Label htmlFor="username">Username</Label>
									<Input
										id="username"
										type="text"
										placeholder="johndoe"
										required
										{...register("username")}
										error={errors.username?.message}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-3">
										<Label htmlFor="firstName">First Name</Label>
										<Input
											id="firstName"
											type="text"
											placeholder="John"
											required
											{...register("firstName")}
										/>
									</div>
									<div className="grid gap-3">
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											id="lastName"
											type="text"
											placeholder="Doe"
											required
											{...register("lastName")}
										/>
									</div>
								</div>
								{errors.firstName !== undefined && (
									<p className="text-xs text-red-500">
										{errors.firstName?.message}
									</p>
								)}
								{errors.lastName && (
									<p className="text-xs text-red-500">
										{errors.lastName?.message}
									</p>
								)}
								<div className="grid gap-3">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										required
										{...register("email")}
										error={errors.email?.message}
									/>
								</div>
								<div className="grid gap-3">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										required
										{...register("password")}
										error={errors.password?.message}
									/>
								</div>
								<Button
									type="submit"
									className="w-full cursor-pointer"
									disabled={loading}
								>
									{!loading ? "Sign up" : <Spinner variant="ellipsis" />}
								</Button>
							</div>
							<div className="text-center text-sm">
								Already have an account?{" "}
								<Link href="/login" className="underline underline-offset-4">
									Login
								</Link>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
