import { X } from "lucide-react";
import Markdown from "react-markdown";

interface Props {
	title: string;
	text: string;
	onClose: () => void;
}

export default function FileViewer({ text, title, onClose }: Props) {
	return (
		<div className="bg-black/30 absolute backdrop-blur-sm size-full top-1/2 z-10 -translate-x-1/2 left-1/2 -translate-y-1/2">
			<div className="flex items-center size-full justify-center">
				<div className="p-10 size-[90%] gap-5 bg-white rounded-xl flex flex-col shadow-lg">
					<div className="flex items-center justify-between border-b">
						<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
							{title}
						</h2>
						<X
							size={26}
							className="hover:scale-110 duration-200 transition-all cursor-pointer"
							onClick={onClose}
						/>
					</div>
					<div className="markdown overflow-scroll flex-1 border-3 rounded-lg p-5">
						<Markdown>{text}</Markdown>
					</div>
				</div>
			</div>
		</div>
	);
}
