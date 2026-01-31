import { IsOptional, IsString } from 'class-validator';

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  url?: string;
}
