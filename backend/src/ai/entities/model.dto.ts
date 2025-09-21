import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ModelNames {
  DEEPSEEK_CHAT = 'deepseek/deepseek-chat-v3.1:free',
  OPENAI_GPT_OSS = 'openai/gpt-oss-120b:free',
  GLM_4_5_AIR = 'z-ai/glm-4.5-air:free',
  KIMI_K2 = 'moonshotai/kimi-k2:free',
  GROK_4_FAST = 'x-ai/grok-4-fast:free',
  NEMOTRON_NANO = 'nvidia/nemotron-nano-9b-v2:free',
}

export class MODEL_DTO {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ModelNames, {
    message: 'modelName must be a valid model identifier',
  })
  model: string;
}
