import { IsString } from 'class-validator';

export class MatchBukuIndukDto {
  @IsString()
  alumniProfileId: string;
}
