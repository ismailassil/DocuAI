"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Zap, SendHorizonal } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import Logo from "@/components/Logo";

type MessageType = {
	role: "user" | "assistant";
	message: string;
	createAt: Date;
};

export default function ChatAssistant() {
	const [messages, setMessages] = useState<MessageType[]>([
		{
			role: "assistant",
			message:
				"Hello! I'm your DocuAI assistant. I can help you search through documents, extract insights, and answer questions about your content. What would you like to know?",
			createAt: new Date(),
		},
	]);
	const inputRef = useRef<HTMLInputElement>(null);
	const [input, setInput] = useState("");
	const [streamedMessage, setStreamedMessage] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [IsHistory, setIsHistory] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		async function getHistory() {
			try {
				const res = await axios.get<MessageType[]>("http://localhost:8008/ai/chat-history");
				setMessages(res.data);
				console.log(res.data);
			} catch (error) {
				console.log(error);
				toast.error("Error - History fetching", {
					position: "top-center",
				});
			}
		}

		setIsHistory(true);
		getHistory();
		setIsHistory(false);

		return () => {};
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, streamedMessage, isStreaming]);

	const handleSendMessage = async () => {
		// e.preventDefault();
		const trimmedInput = input.trim();
		if (!trimmedInput) return;

		/// add user message
		setMessages((prev) => [...prev, { role: "user", message: input, createAt: new Date() }]);
		setInput("");

		setIsStreaming(true);
		try {
			const response = await fetch(
				"http://localhost:8008/ai/ask?question=" + encodeURIComponent(trimmedInput),
			);
			if (!response.ok) {
				console.log(response);
				throw new Error(`Response status: ${response.status}`);
			}
			console.log(response.body);
			setIsStreaming(false);
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
			setMessages((prev) => [
				...prev,
				{ role: "assistant", message: newMessage, createAt: new Date() },
			]);
			toast.info("FINISH", {
				position: "top-center",
			});
		} catch (error) {
			toast.error("ERROR FOUND");
			console.log(error);
		} finally {
			setIsStreaming(false);
			setStreamedMessage("");
			inputRef.current?.focus();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	if (IsHistory) return <Spinner />;

	return (
		<div className="h-screen bg-background flex flex-col">
			{/* Header */}
			<header className="border-b bg-card flex-shrink-0">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-2">
								<Logo />
								<span className="text-xl font-bold">DocuAI</span>
							</div>
						</div>
						<nav className="flex items-center gap-4">
							<Link
								href="/dashboard"
								className="text-foreground/70 hover:text-foreground"
							>
								Dashboard
							</Link>
							<Link
								href="/chat"
								className="text-secondary underline underline-offset-8 decoration-2"
							>
								Assistant
							</Link>
							<Button variant="outline" size="sm">
								Settings
							</Button>
						</nav>
					</div>
				</div>
			</header>

			{/* Chat Container */}
			<div className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col min-h-0">
				<Card className="flex-1 flex py-0 flex-col min-h-0">
					{/* Chat Header */}
					<div className="p-4 border-b flex-shrink-0">
						<div className="flex items-center gap-2">
							<Bot className="h-5 w-5 text-secondary" />
							<h2 className="font-semibold">AI Document Assistant</h2>
						</div>
						<p className="text-sm text-foreground/70 mt-1">
							Ask questions about your documents, get insights, and search through
							your content
						</p>
					</div>

					{/* Messages Area */}
					<div className="flex-1 min-h-0 bg-white">
						<ScrollArea className="h-full p-4">
							<div className="space-y-4">
								{messages.map((message, index) => (
									<div
										key={index}
										className={`flex gap-3 ${
											message.role === "user"
												? "justify-end"
												: "justify-start"
										}`}
									>
										{message.role === "assistant" && (
											<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
												<Bot className="h-4 w-4 text-secondary-foreground" />
											</div>
										)}

										<div
											className={`max-w-[70%] rounded-lg px-4 py-2 ${
												message.role === "user"
													? "bg-primary text-primary-foreground"
													: "bg-gray-100 text-gray-900 border"
											}`}
										>
											<p className="text-sm">{message.message}</p>
											<p
												className={`text-xs mt-1 ${
													message.role === "user"
														? "opacity-70"
														: "text-gray-600"
												}`}
											>
												{new Date(message.createAt).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
										</div>

										{message.role === "user" && (
											<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
												<User className="h-4 w-4 text-primary-foreground" />
											</div>
										)}
									</div>
								))}

								{isStreaming && (
									<div className="flex gap-3 justify-start">
										<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
											<Bot className="h-4 w-4 text-secondary-foreground" />
										</div>
										<div className="bg-gray-100 text-gray-900 border rounded-lg px-4 py-2">
											<Spinner size={15} variant="ellipsis" />
										</div>
									</div>
								)}
								{streamedMessage && (
									<div className="flex gap-3 justify-start">
										<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
											<Bot className="h-4 w-4 text-secondary-foreground" />
										</div>
										<div
											className={`max-w-[70%] rounded-lg px-4 py-2 bg-gray-100 text-gray-900 border`}
										>
											<p className="text-sm">{streamedMessage}</p>
										</div>
									</div>
								)}

								<div ref={messagesEndRef} />
							</div>
						</ScrollArea>
					</div>

					{/* Input Area */}
					<div className="p-4 border-t flex-shrink-0">
						<div className="flex gap-2">
							<Input
								ref={inputRef}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Ask me anything about your documents..."
								disabled={isStreaming}
								className="flex-1 placeholder:text-gray-500 ring-1 ring-gray-300"
							/>
							<Button
								onClick={handleSendMessage}
								disabled={!input.trim() || isStreaming}
								size="icon"
							>
								<SendHorizonal className="h-4 w-4" />
							</Button>
						</div>
						<p className="text-xs text-gray-600 mt-2">
							Press Enter to send, Shift+Enter for new line
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
}
