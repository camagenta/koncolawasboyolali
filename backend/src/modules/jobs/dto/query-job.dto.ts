import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipeLowongan {
  full_time = 'full_time',
  part_time = 'part_time',
  internship = 'internship',
}

export enum StatusLowongan {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export class QueryJobDto {
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
  @IsEnum(StatusLowongan)
  status?: StatusLowongan;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
