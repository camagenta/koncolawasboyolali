import { IsOptional, IsEnum, IsBoolean, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRoleEnum {
  super_admin = 'super_admin',
  admin_unit = 'admin_unit',
  alumni = 'alumni',
}

export class QueryUserDto {
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

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  q?: string;
}
