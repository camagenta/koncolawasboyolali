import { IsString, IsOptional, IsUUID, IsIn } from 'class-validator';

export class SendMessageDto {
  @IsOptional()
  @IsUUID()
  receiverId?: string;

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsIn(['text', 'file'])
  messageType?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
