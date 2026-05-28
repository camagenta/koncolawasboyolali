import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  jenjang: string;

  @IsString()
  @IsNotEmpty()
  institusi: string;

  @IsString()
  @IsOptional()
  jurusan?: string;

  @IsNumber()
  @IsOptional()
  tahunMasuk?: number;

  @IsNumber()
  @IsOptional()
  tahunLulus?: number;

  @IsString()
  @IsNotEmpty()
  status: string;
}
