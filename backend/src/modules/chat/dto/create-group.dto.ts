import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['public', 'private'])
  type?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  maxMembers?: number;
}
