import { AI_ROLES } from './ai_role.enum';

export interface MESSAGE_DTO {
  message: string;
  role: AI_ROLES;
}
