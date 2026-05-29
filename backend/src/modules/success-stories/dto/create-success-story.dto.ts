import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateSuccessStoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  angkatan: number;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsNotEmpty()
  achievement: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
