import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  // ======================
  // GET ALL (TREE)
  // ======================
  async findAll() {
    const menus = await this.menuRepo.find({
      relations: ['parent', 'children'],
      order: { order: 'ASC' },
    });

    return this.buildTree(menus);
  }

  private buildTree(menus: Menu[], parentId: number | null = null) {
    return menus
      .filter((m) =>
        parentId === null ? m.parent === null : m.parent?.id === parentId,
      )
      .map((m) => ({
        ...m,
        children: this.buildTree(menus, m.id),
      }));
  }

  // ======================
  // GET ONE
  // ======================
  async findOne(id: number) {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  // ======================
  // CREATE
  // ======================
  async create(dto: CreateMenuDto) {
    let parent: Menu | null = null;

    if (dto.parentId) {
      parent = await this.menuRepo.findOneBy({ id: dto.parentId });
      if (!parent) {
        throw new NotFoundException('Parent menu not found');
      }
    }

    const menu = this.menuRepo.create({
      title: dto.title,
      url: dto.url,
      parent: parent ?? null,
    });

    return this.menuRepo.save(menu);
  }

  // ======================
  // UPDATE
  // ======================
  async update(id: number, dto: UpdateMenuDto) {
    const menu = await this.menuRepo.findOneBy({ id });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    Object.assign(menu, dto);
    return this.menuRepo.save(menu);
  }

  // ======================
  // DELETE
  // ======================
  async remove(id: number) {
    const menu = await this.menuRepo.findOneBy({ id });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    await this.menuRepo.remove(menu);
    return { message: 'Menu deleted' };
  }

  // ======================
  // MOVE (BONUS)
  // ======================
  async move(id: number, newParentId?: number) {
    const menu = await this.menuRepo.findOne({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    let newParent: Menu | null = null;

    if (newParentId !== undefined) {
      newParent = await this.menuRepo.findOneBy({ id: newParentId });
      if (!newParent) {
        throw new NotFoundException('New parent not found');
      }
    }

    menu.parent = newParent;
    return this.menuRepo.save(menu);
  }

  // ======================
  // REORDER (BONUS)
  // ======================
  async reorder(id: number, newOrder: number) {
    const menu = await this.menuRepo.findOneBy({ id });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    menu.order = newOrder;
    return this.menuRepo.save(menu);
  }
}
