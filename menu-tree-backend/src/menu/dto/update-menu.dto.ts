import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsNumber()
  parent_id?: number | null;
}
