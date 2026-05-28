import { IsEnum } from 'class-validator';

export enum UserRoleEnum {
  super_admin = 'super_admin',
  admin_unit = 'admin_unit',
  alumni = 'alumni',
}

export class UpdateRoleDto {
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
