import { IsString, IsUUID } from 'class-validator';

export class CreateThreadDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
