import { Controller, Get, Query, Res, ValidationPipe } from '@nestjs/common';
import { AIService } from './ai.service';
import type { Response } from 'express';
// import { QuestionDTO } from './entities/question.dto';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('/ask')
  async askAI(
    @Query('question', new ValidationPipe()) query: string,
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

    const res = await this.aiService.semanticSearch(query);

    for await (const part of res) {
      response.write(part.choices[0].delta?.content);
    }
    response.end();
  }
}
