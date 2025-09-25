"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useAuth } from "@/api_client/AuthContext";
import { ModelNames, Navbar } from "@/components/ui/shadcn-io/navbar-13";
import { ComboBox } from "@/components/ComboBox";

type MessageType = {
	role: "user" | "assistant";
	message: string;
	createAt: Date;
};

export default function ChatAssistant() {
	const [model, setModel] = useState<ModelNames>("deepseek/deepseek-chat-v3.1:free");
	const [selId, setSelId] = useState(-1);
	const [messages, setMessages] = useState<MessageType[]>([
		{
			role: "assistant",
			message: `Hello! I'm your DocuAI assistant. 
				I can help you search through documents, extract insights, 
				and answer questions about your content.
				What would you like to know?`,
			createAt: new Date(),
		},
	]);
	const inputRef = useRef<HTMLInputElement>(null);
	const [input, setInput] = useState("");
	const [streamedMessage, setStreamedMessage] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [IsHistory, setIsHistory] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { axiosPrivate } = useAuth();

	useEffect(() => {
		async function getHistory() {
			try {
				const res = await axiosPrivate.get<MessageType[]>("/ai/chat-history");
				if (res.data.length !== 0) {
					setMessages(res.data);
				}
			} catch (error) {
				toast.error("Error - History fetching " + (error as Error).message);
			} finally {
				setIsHistory(false);
			}
		}

		getHistory();

		return () => {};
	}, [axiosPrivate]);

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
			let newMessage: string = "";
			await axiosPrivate.get("/ai/ask", {
				params: {
					question: trimmedInput,
					file_id: selId === -1 ? undefined : selId,
					model,
				},
				responseType: "stream",
				onDownloadProgress(progressEvent) {
					const chunk = progressEvent.event.originalTarget.response;
					if (chunk && !isErrorResponse(chunk)) {
						setIsStreaming(false);
						newMessage = chunk;
						setStreamedMessage(chunk);
					}
				},
				timeout: 3 * 60 * 1000,
			});

			setMessages((prev) => [
				...prev,
				{ role: "assistant", message: newMessage, createAt: new Date() },
			]);
			toast.info("FINISH", {
				position: "top-center",
			});
		} catch (error) {
			toast.error("Error " + (error as Error).message);
		} finally {
			setIsStreaming(false);
			setStreamedMessage("");
			inputRef.current?.focus();
		}
	};

	function isErrorResponse(chunk: string) {
		try {
			const content = JSON.parse(chunk);

			return content.statusCode && content.error;
		} catch {
			return false;
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	function handleChangeModle(model: string) {
		setModel(model as ModelNames);
	}

	return (
		<div className="min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] bg-background flex flex-col">
			{/* Chat Container */}
			<div className="flex-1 container mx-auto px-4 py-6 w-full flex flex-col min-h-0">
				<Card className="flex-1 flex py-0 flex-col min-h-0 !gap-0">
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
					{IsHistory && (
						<Spinner
							className="mx-auto h-screen text-blue-500"
							variant="infinite"
							size={40}
						/>
					)}
					<div className="flex-1 min-h-0 overflow-y-scroll bg-white">
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
					<div className="px-4 pt-4 space-y-3 border-t flex-shrink-0">
						<ComboBox valueId={selId} setValueId={setSelId} />
						<div className="w-full">
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
								<div className="relative">
									<Navbar onModelChange={handleChangeModle} />
								</div>
								<Button
									onClick={handleSendMessage}
									disabled={!input.trim() || isStreaming}
									size="icon"
								>
									<SendHorizonal className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
					<p className="px-4 pb-4 text-xs text-gray-600 mt-2">
						Press Enter to send, Shift+Enter for new line
					</p>
				</Card>
			</div>
		</div>
	);
}
