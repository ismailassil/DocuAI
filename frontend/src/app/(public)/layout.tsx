"use client";
import RootLoading from "@/components/RootLoading";
import { useAuth } from "@/api_client/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PrivateHeader from "@/components/PrivateHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && isAuthenticated) {
			router.replace("/dashboard");
		}
	}, [isAuthenticated, loading, router]);

	if (loading) return <RootLoading />;

	return (
		<main>
			<PrivateHeader />
			{children}
		</main>
	);
}
