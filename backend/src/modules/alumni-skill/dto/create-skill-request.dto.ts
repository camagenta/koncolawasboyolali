import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { SkillFormat } from '../../../generated/prisma/index.js';

export class CreateSkillRequestDto {
  @IsString()
  @IsNotEmpty()
  skillKategori: string;

  @IsString()
  @IsNotEmpty()
  deskripsi: string;

  @IsEnum(SkillFormat)
  @IsOptional()
  format?: SkillFormat;
}
