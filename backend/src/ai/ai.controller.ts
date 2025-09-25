import {
  Controller,
  Get,
  NotFoundException,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AIService } from './ai.service';
import type { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { QUESTION_DTO } from './entities/question.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FILEID_DTO, MODEL_DTO } from './entities/model.dto';
import { EXTRACTED_JWT_PAYLOAD } from 'src/auth/entities/jwt.payload';

@UseGuards(AuthGuard)
@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('/ask')
  async askAI(
    @Req() request: Request,
    @Query(ValidationPipe)
    query: QUESTION_DTO,
    @Query(ValidationPipe)
    { model }: MODEL_DTO,
    @Query(ValidationPipe)
    { file_id }: FILEID_DTO,
    @Res()
    response: Response,
  ) {
    const retUser = request['user'] as EXTRACTED_JWT_PAYLOAD;
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

    const user = await this.databaseService.getUserById(retUser.sub);
    if (!user) throw new NotFoundException('User Not Found');

    const FileContent: string = await this.aiService.getFileContent(
      user.id,
      file_id,
    );

    // parse the query to not exceed a certain length (200 characters)
    const messages = await this.databaseService.getUserMessageContextByLimit(
      user.id,
    );

    const question = query.question.trim().slice(0, 500);
    const res = await this.aiService.semanticSearch(
      model,
      messages,
      question,
      FileContent,
    );

    let ai_response: string = '';

    for await (const part of res) {
      response.write(part.choices[0].delta?.content);
      ai_response += part.choices[0].delta?.content;
    }

    await this.databaseService.registerMessage(user, question, 'user');
    await this.databaseService.registerMessage(user, ai_response, 'assistant');

    response.end();
  }

  @Get('/chat-history')
  async getChatHistory() {
    return await this.databaseService.getUserMessages(1);
  }
}
