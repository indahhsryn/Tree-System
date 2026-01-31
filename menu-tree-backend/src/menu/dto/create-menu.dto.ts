import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
