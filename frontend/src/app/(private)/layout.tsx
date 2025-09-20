"use client";
import RootLoading from "@/components/RootLoading";
import { useAuth } from "@/api_client/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PrivateHeader from "@/components/PrivateHeader";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.replace("/login");
		}
	}, [isAuthenticated, loading, router]);

	console.log("[PRIVATE LAYOUT] REDERENRING....");
	if (loading) return <RootLoading />;

	if (!isAuthenticated) return null;

	return (
		<main>
			<PrivateHeader />
			{children}
		</main>
	);
}
