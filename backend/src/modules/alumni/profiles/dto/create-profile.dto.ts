import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { StatusUtama } from '../../../../generated/prisma/index.js';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  namaLengkap: string;

  @IsString()
  @IsNotEmpty()
  noHp: string;

  @IsNumber()
  @IsNotEmpty()
  tahunMasuk: number;

  @IsNumber()
  @IsNotEmpty()
  tahunLulus: number;

  @IsString()
  @IsOptional()
  jurusan?: string;

  @IsString()
  @IsOptional()
  kelas1?: string;

  @IsString()
  @IsOptional()
  kelas2?: string;

  @IsString()
  @IsNotEmpty()
  kelas3: string;

  @IsString()
  @IsNotEmpty()
  kotaDomisili: string;

  @IsString()
  @IsNotEmpty()
  kecamatanAsalBoyolali: string;

  @IsString()
  @IsOptional()
  alamatLengkap?: string;

  @IsString()
  @IsOptional()
  linkLinkedin?: string;

  @IsString()
  @IsOptional()
  linkInstagram?: string;

  @IsEnum(StatusUtama)
  @IsOptional()
  statusUtama?: StatusUtama;
}
