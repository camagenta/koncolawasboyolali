import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum TipeLowongan {
  full_time = 'full_time',
  part_time = 'part_time',
  internship = 'internship',
}

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  kategoriBidang?: string;

  @IsOptional()
  @IsString()
  lokasi?: string;

  @IsEnum(TipeLowongan)
  tipe: TipeLowongan;

  @IsString()
  linkExternal: string;

  @IsOptional()
  @IsString()
  kontak?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
