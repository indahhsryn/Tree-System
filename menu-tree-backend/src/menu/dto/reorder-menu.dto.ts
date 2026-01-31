import { IsNumber } from 'class-validator';

export class ReorderMenuDto {
  @IsNumber()
  newOrder: number;
}
