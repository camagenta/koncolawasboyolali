import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { SkillFormat, SkillLevel } from '../../../generated/prisma/index.js';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  skill: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsString()
  @IsNotEmpty()
  kategori: string;

  @IsEnum(SkillFormat)
  @IsNotEmpty()
  format: SkillFormat;

  @IsEnum(SkillLevel)
  @IsOptional()
  level?: SkillLevel;

  @IsString()
  @IsOptional()
  durasi?: string;

  @IsString()
  @IsOptional()
  ketersediaan?: string;
}
