"use client";
import RootLoading from "@/components/RootLoading";
import { useAuth } from "@/api_client/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && isAuthenticated) {
			router.replace("/dashboard");
		}
	}, [isAuthenticated, loading, router]);

	if (loading) return <RootLoading />;

	if (isAuthenticated) return null;

	return <main>{children}</main>;
}
