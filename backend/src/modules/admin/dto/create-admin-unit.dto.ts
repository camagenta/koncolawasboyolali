import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateAdminUnitDto {
  @IsString()
  userId: string;

  @IsString()
  unitName: string;

  @IsOptional()
  @IsInt()
  tahunMasukTarget?: number;
}
