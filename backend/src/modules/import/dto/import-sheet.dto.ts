import { IsString, IsOptional } from 'class-validator';

export class ImportSheetDto {
  @IsString()
  sheetUrl: string;

  @IsString()
  @IsOptional()
  sheetRange?: string;
}
