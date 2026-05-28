import { IsString } from 'class-validator';

export class RejectJobDto {
  @IsString()
  rejectionReason: string;
}
