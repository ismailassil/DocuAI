import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Message } from './entities/message.entity';
import { AI_ROLES } from './entities/ai_role.enum';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import PdfParse from 'pdf-parse';
import path from 'path';
import { FileInfo } from 'src/user/entities/file_info.type';
import { EXT } from './entities/ext.enum';
import WordExtractor from 'word-extractor';

interface AI_MESSAGE {
  role: AI_ROLES;
  content: string;
}

@Injectable()
export class AIService {
  private AI: OpenAI;

  constructor(private configService: ConfigService) {
    this.AI = new OpenAI({
      baseURL: configService.getOrThrow('AI_BASE_URL'),
      apiKey: configService.getOrThrow('AI_API_KEY'),
    });
  }

  async semanticSearch(messages: Message[] | null, query: string) {
    const context: AI_MESSAGE[] = this.getContext(messages, query);

    console.log(context);

    try {
      const response = await this.AI.chat.completions.create({
        model: this.configService.getOrThrow('DEEPSEEK_MODEL'),
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

  async analyzeDocs(fileInfo: FileInfo) {
    const fileContent = await this.extractTextFromFile(fileInfo);

    try {
      const response = await this.AI.chat.completions.create({
        model: this.configService.getOrThrow('DEEPSEEK_MODEL'),
        messages: [
          {
            role: 'system',
            content: `You are an assistant that analyzes documents and produces clear,
            concise summaries retaining all essential details without omission.
            Write the summarized text as a markdown format.`,
          },
          {
            role: 'user',
            content: 'Document Content:\n' + fileContent,
          },
        ],
        temperature: 0.2,
      });

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async extractTextFromFile(fileInfo: FileInfo): Promise<string> {
    let content: string = '';
    const file_path = path.join(__dirname, '../../uploads', fileInfo.name);

    switch (fileInfo.ext as EXT) {
      case EXT.PDF: {
        const dataBuffer = fs.readFileSync(file_path);
        const pdfData = await PdfParse(dataBuffer as Buffer<ArrayBufferLike>);
        content = pdfData.text;
        break;
      }
      case EXT.DOCX:
      case EXT.DOC: {
        const wordExtrator = new WordExtractor();
        const extracted = await wordExtrator.extract(file_path);
        content = extracted.getBody();
        break;
      }
      case EXT.TXT: {
        fs.readFile(file_path, 'utf-8', (err, data) => {
          if (err) {
            console.error('Error reading file', err);
            return;
          }
          content = data;
        });
      }
    }

    return content;
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
