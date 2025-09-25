import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { Message } from './entities/message.entity';
import { AI_ROLES } from './entities/ai_role.enum';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import PdfParse from 'pdf-parse';
import path from 'path';
import { FileInfo } from 'src/user/entities/file_info.type';
import { EXTENSTION } from './entities/ext.enum';
import WordExtractor from 'word-extractor';
import { ModelNames } from './entities/model.dto';
import { DatabaseService } from 'src/database/database.service';

interface AI_MESSAGE {
  role: AI_ROLES;
  content: string;
}

@Injectable()
export class AIService {
  private AI: OpenAI;

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    this.AI = new OpenAI({
      baseURL: configService.getOrThrow('AI_BASE_URL'),
      apiKey: configService.getOrThrow('AI_API_KEY'),
    });
  }

  async semanticSearch(
    model: ModelNames,
    messages: Message[] | null,
    query: string,
    content: string,
  ) {
    const context: AI_MESSAGE[] = this.getContext(messages, query);

    const modelENV = this.getModelENV(model);
    console.log('AI Context', context);

    try {
      const response = await this.AI.chat.completions.create({
        model: this.configService.getOrThrow(modelENV),
        messages: [
          {
            role: 'system',
            content: `You are a powerful search engine. You are a Document Assistant that answer what the user wants
              about a certain file will be promted to you as text, help the user get answers from the document, only from the document.
              The document should be SELECTED by the user.
              For each user message, respond ONLY to the latest user message.
              Do NOT consider earlier messages unless the latest message explicitly mentions or references them.
              If the latest message does NOT mention any previous topic, 
              answer concisely based on the latest message alone.
              ONLY RESPOND TO THE CONCISELY LATEST MESSAGE`,
          },
          {
            role: 'system',
            content: 'file content: ' + content,
          },
          {
            role: 'system',
            content: `IF THE CONTENT OF THE FILE IS NOT NULL,
              answer the user's question about only the content of the file.
              DO NOT ANSWER ANY UNRELATED QUESTIONS BESIDE THE FILE`,
          },
          ...context,
        ],
        temperature: 0.2,
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
      console.error('Error Analyzing');
      console.error(error);
      throw error;
    }
  }

  private async extractTextFromFile(fileInfo: FileInfo): Promise<string> {
    let content: string = '';
    const file_path = path.join(__dirname, '../../uploads', fileInfo.name);

    switch (fileInfo.extension as EXTENSTION) {
      case EXTENSTION.PDF: {
        const dataBuffer = fs.readFileSync(file_path);
        const pdfData = await PdfParse(dataBuffer as Buffer<ArrayBufferLike>);
        content = pdfData.text;
        break;
      }
      case EXTENSTION.DOCX:
      case EXTENSTION.DOC: {
        const wordExtrator = new WordExtractor();
        const extracted = await wordExtrator.extract(file_path);
        content = extracted.getBody();
        break;
      }
      case EXTENSTION.TXT: {
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

  getModelENV(model: ModelNames) {
    switch (model) {
      case ModelNames.DEEPSEEK_CHAT:
        return 'DEEPSEEK_MODEL';
      case ModelNames.GLM_4_5_AIR:
        return 'GLM_MODEL';
      case ModelNames.GROK_4_FAST:
        return 'GROK_MODEL';
      case ModelNames.KIMI_K2:
        return 'KIMI_MODEL';
      case ModelNames.NEMOTRON_NANO:
        return 'NVIDIA_MODEL';
      case ModelNames.OPENAI_GPT_OSS:
        return 'OPENAI_MODEL';
      default:
        throw new NotFoundException(
          'Model Not Found | Selected by user' + (model as string),
        );
    }
  }

  async getFileContent(userId: number, fileId: number) {
    const fileInfo = await this.databaseService.getUserFileById(userId, fileId);

    if (!fileInfo) throw new NotFoundException('File Not Found');

    // const filePath = path.join(__dirname, '../../uploads/' + fileInfo.filename);

    try {
      const content = this.extractTextFromFile(
        new FileInfo(fileInfo.filename, fileInfo.extension),
      );
      return content;
    } catch (error) {
      console.log('Error While Reading File');
      throw new InternalServerErrorException(
        'Error while reading file',
        (error as Error).message,
      );
    }
  }
}
