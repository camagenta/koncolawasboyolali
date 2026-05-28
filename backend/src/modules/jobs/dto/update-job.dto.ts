import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum TipeLowongan {
  full_time = 'full_time',
  part_time = 'part_time',
  internship = 'internship',
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  kategoriBidang?: string;

  @IsOptional()
  @IsString()
  lokasi?: string;

  @IsOptional()
  @IsEnum(TipeLowongan)
  tipe?: TipeLowongan;

  @IsOptional()
  @IsString()
  linkExternal?: string;

  @IsOptional()
  @IsString()
  kontak?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
