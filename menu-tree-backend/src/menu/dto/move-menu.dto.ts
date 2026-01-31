import { IsNumber, IsOptional } from 'class-validator';

export class MoveMenuDto {
  @IsOptional()
  @IsNumber()
  newParentId?: number;
}
