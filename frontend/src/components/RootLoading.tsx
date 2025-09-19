import { Spinner } from "./ui/shadcn-io/spinner";

export default function RootLoading() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center flex items-center flex-col">
				<Spinner size={80} variant="circle-filled" className="text-blue-500" />
				<p className="mt-4 text-gray-600 animate-pulse">Redirecting...</p>
			</div>
		</div>
	);
}
