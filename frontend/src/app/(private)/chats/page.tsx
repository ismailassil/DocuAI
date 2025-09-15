"use client";

// import Logo from "@/components/Logo";
import { SiteHeader } from "@/components/site-header";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import {
	PromptInput,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputToolbar,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { SidebarInset } from "@/components/ui/sidebar";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

type MessageType = {
	from: "user" | "assistant";
	content: string;
};

export default function Page() {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [streamedMessage, setStreamedMessage] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmedInput = input.trim();
		if (!trimmedInput) return;

		/// add user message
		setMessages((prev) => [...prev, { from: "user", content: input }]);
		setInput("");

		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:8008/openai/ask?question=" + encodeURIComponent(trimmedInput),
			);
			if (!response.ok) throw new Error(`Response status: ${response.status}`);
			setLoading(false);
			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let newMessage: string = "";
			while (true) {
				const { value, done } = await reader?.read();
				if (done) break;
				if (value) {
					const chunk = decoder.decode(value, { stream: true });
					newMessage += chunk;
					setStreamedMessage((prev) => prev + chunk);
				}
			}
			setMessages((prev) => [...prev, { from: "assistant", content: newMessage }]);
			toast.info("FINISH");
		} catch (error) {
			toast.error("ERROR FOUND");
			console.log(error);
		} finally {
			setLoading(false);
			setStreamedMessage("");
		}
	}

	return (
		<SidebarInset>
			<SiteHeader siteName="Start new Chat" />
			<div className="px-4 pb-4 flex flex-1 flex-col">
				<div className="flex flex-1 flex-col gap-2 h-full py-2 md:gap-6 md:py-4">
					{messages.map((msg, i) => (
						<Message from={msg.from} key={i}>
							<MessageContent>{msg.content}</MessageContent>
						</Message>
					))}
					{loading && (
						<Message from="assistant">
							<MessageContent>
								<Spinner size={15} variant="ellipsis" />
							</MessageContent>
						</Message>
					)}
					{streamedMessage && (
						<Message from={"assistant"}>
							<MessageContent>{streamedMessage}</MessageContent>
						</Message>
					)}
				</div>
				<PromptInput onSubmit={handleSubmit}>
					<PromptInputTextarea
						value={input}
						onChange={(e) => setInput(e.currentTarget.value)}
						placeholder="Type your message..."
					/>
					<PromptInputToolbar>
						<Image
							src={"/deepseek.svg"}
							alt="Logo"
							width={25}
							height={25}
							className="ml-2 cursor-pointer"
						/>
						<PromptInputSubmit disabled={!input.trim()} />
					</PromptInputToolbar>
				</PromptInput>
			</div>
		</SidebarInset>
	);
}
