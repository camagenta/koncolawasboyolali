import { IsString, IsOptional, IsInt, IsIn, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['public', 'angkatan'])
  type?: string;

  @IsOptional()
  @IsInt()
  tahunMasukTarget?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
