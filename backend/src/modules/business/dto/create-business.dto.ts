import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { BusinessCategory } from '../../../generated/prisma/index.js';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  namaUsaha: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsEnum(BusinessCategory)
  @IsNotEmpty()
  kategori: BusinessCategory;

  @IsString()
  @IsOptional()
  noKontak?: string;

  @IsString()
  @IsOptional()
  linkWebsite?: string;

  @IsString()
  @IsOptional()
  linkInstagram?: string;

  @IsString()
  @IsOptional()
  alamat?: string;

  @IsBoolean()
  @IsOptional()
  cariMitra?: boolean;
}
