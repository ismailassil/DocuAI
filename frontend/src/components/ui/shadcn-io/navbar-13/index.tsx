"use client";

import * as React from "react";
import { BotMessageSquareIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Types
export interface NavbarAIModel {
	value: string;
	name: string;
	// description: string;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
	models?: NavbarAIModel[];
	defaultModel?: string;
	userName?: string;
	userEmail?: string;
	userAvatar?: string;
	onModelChange?: (model: string) => void;
	onTempChatClick?: () => void;
	onUserItemClick?: (item: string) => void;
}

// Default AI models
const defaultModels = [
	{
		value: "deepseek/deepseek-chat-v3.1:free",
		name: "DeepSeek Chat v3.1",
	},
	{
		value: "openai/gpt-oss-120b:free",
		name: "GPT OSS 120B",
	},
	{
		value: "z-ai/glm-4.5-air:free",
		name: "GLM 4.5 Air",
	},
	{
		value: "moonshotai/kimi-k2:free",
		name: "Kimi K2",
	},
	{
		value: "x-ai/grok-4-fast:free",
		name: "Grok 4 Fast",
	},
	{
		value: "nvidia/nemotron-nano-9b-v2:free",
		name: "Nemotron Nano 9B v2",
	},
] as const;

export type ModelNames = typeof defaultModels[number]["value"];

export const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
	(
		{
			className,
			models = defaultModels,
			defaultModel = "deepseek/deepseek-chat-v3.1:free",
			onModelChange,
			...props
		},
		ref,
	) => {
		return (
			<div ref={ref} {...props} className={"flex items-center justify-between " + className}>
				{/* Left side */}
				<div>
					<Select
						defaultValue={defaultModel}
						onValueChange={onModelChange}
						aria-label="Select AI model"
					>
						<SelectTrigger className="cursor-pointer [&>svg]:text-muted-foreground/80 **:data-desc:hidden [&>svg]:shrink-0">
							<BotMessageSquareIcon size={16} aria-hidden="true" />
							<SelectValue placeholder="Choose an AI model" />
						</SelectTrigger>
						<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
							<SelectGroup>
								<SelectLabel className="ps-2">Models</SelectLabel>
								{models.map((model) => (
									<SelectItem
										key={model.value}
										className="cursor-pointer"
										value={model.value}
									>
										{model.name}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
);

Navbar.displayName = "Navbar";
