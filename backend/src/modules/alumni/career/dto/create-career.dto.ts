import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty()
  perusahaan: string;

  @IsString()
  @IsNotEmpty()
  jabatan: string;

  @IsString()
  @IsOptional()
  sektorIndustri?: string;

  @IsNumber()
  @IsOptional()
  tahunMulai?: number;

  @IsNumber()
  @IsOptional()
  tahunSelesai?: number;

  @IsString()
  @IsOptional()
  kotaPenempatan?: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
