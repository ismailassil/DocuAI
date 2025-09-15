import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private deepSeekAI: OpenAI;

  constructor() {
    this.deepSeekAI = new OpenAI({
      baseURL: process.env.AI_BASE_URL,
      apiKey: process.env.AI_API_KEY,
    });
  }

  async semanticSearch(query: string) {
    try {
      const response = await this.deepSeekAI.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a powerful search engine. Return concise, factual answers.',
          },
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.3,
        max_completion_tokens: 150,
        stream: true,
      });

      return response;
    } catch (error) {
      console.error('Seach Error:', (error as Error).message);
      throw error;
    }
  }
}
