import { ChatMessageType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendChatMessageDto {
  @IsString()
  @MaxLength(2000)
  content!: string;

  @IsOptional()
  @IsEnum(ChatMessageType)
  type?: ChatMessageType;
}
