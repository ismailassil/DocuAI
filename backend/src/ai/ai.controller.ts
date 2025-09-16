import { Controller, Get, Query, Res, ValidationPipe } from '@nestjs/common';
import { AIService } from './ai.service';
import type { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { QUESTION_DTO } from './entities/question.dto';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('/ask')
  async askAI(
    @Query(new ValidationPipe())
    query: QUESTION_DTO,
    @Res() response: Response,
  ) {
    /**  Let the client know that the incoming response will be an SSE (server-sent events)
     *   a continuous stream of data sent from the server
     */
    response.setHeader('Content-Type', 'text/event-stream');
    /**
     * No Caching - prevent the browser (client) from caching the streamed data
     */
    response.setHeader('Cache-Control', 'no-cache');
    /**
     * Keep the connection alive, so that the streamed data will arrived
     */
    response.setHeader('Connection', 'keep-alive');
    /**
     * Send the header immediately
     */
    response.flushHeaders();

    // parse the query to not exceed a certain length (200 characters)
    const messages = await this.databaseService.getUserMessageContextByLimit(1);

    const question = query.question.trim().slice(0, 500);
    const res = await this.aiService.semanticSearch(messages, question);

    let ai_response: string = '';

    for await (const part of res) {
      response.write(part.choices[0].delta?.content);
      ai_response += part.choices[0].delta?.content;
    }

    await this.databaseService.registerMessage(1, question, 'user');
    await this.databaseService.registerMessage(1, ai_response, 'assistant');

    response.end();
  }

  @Get('/chat-history')
  async getChatHistory() {
    return await this.databaseService.getUserMessages(1);
  }
}
