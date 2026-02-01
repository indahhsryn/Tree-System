import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MoveMenuDto } from './dto/move-menu.dto';
import { ReorderMenuDto } from './dto/reorder-menu.dto';

@Controller('api/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.menuService.remove(+id);
  }

  // ======================
  // MOVE
  // ======================
  @Patch(':id/move')
  move(
    @Param('id') id: number,
    @Body() dto: MoveMenuDto,
  ) {
    // ⬇️ FIX UTAMA: undefined → null
    return this.menuService.move(+id, dto.newParentId ?? null);
  }

  // ======================
  // REORDER
  // ======================
  @Patch(':id/reorder')
  reorder(
    @Param('id') id: number,
    @Body() dto: ReorderMenuDto,
  ) {
    return this.menuService.reorder(+id, dto.newOrder);
  }
}
