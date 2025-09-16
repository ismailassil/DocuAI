import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Message } from './entities/message.entity';
import { AI_ROLES } from './entities/ai_role.enum';

interface AI_MESSAGE {
  role: AI_ROLES;
  content: string;
}

@Injectable()
export class AIService {
  private deepSeekAI: OpenAI;

  constructor() {
    this.deepSeekAI = new OpenAI({
      baseURL: process.env.AI_BASE_URL,
      apiKey: process.env.AI_API_KEY,
    });
  }

  async semanticSearch(messages: Message[] | null, query: string) {
    const context: AI_MESSAGE[] = this.getContext(messages, query);

    console.log(context);

    try {
      const response = await this.deepSeekAI.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a powerful search engine. 
              For each user message, respond ONLY to the latest user message.
              Do NOT consider earlier messages unless the latest message explicitly mentions or references them.
              If the latest message does NOT mention any previous topic, 
              answer concisely based on the latest message alone.
              ONLY RESPOND TO THE CONCISELY LATEST MESSAGE`,
          },
          ...context,
        ],
        temperature: 0.2,
        max_completion_tokens: 150,
        stream: true,
      });

      return response;
    } catch (error) {
      console.error('Seach Error:', (error as Error).message);
      throw error;
    }
  }

  private getContext(messages: Message[] | null, query: string): AI_MESSAGE[] {
    const userContext: AI_MESSAGE = {
      role: 'user',
      content: query,
    };

    const context: AI_MESSAGE[] =
      messages?.map((msg) => ({
        role: 'user',
        content: 'previous message: ' + msg.message,
      })) ?? [];

    const returnContext = context.reverse();

    returnContext.push(userContext);

    return returnContext;
  }
}
