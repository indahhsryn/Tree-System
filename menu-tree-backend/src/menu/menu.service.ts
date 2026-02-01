import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
  // FIND ALL (TREE)
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
      .filter(menu =>
        parentId === null
          ? menu.parent === null
          : menu.parent?.id === parentId,
      )
      .map(menu => ({
        ...menu,
        children: this.buildTree(menus, menu.id),
      }));
  }

  // ======================
  // FIND ONE
  // ======================
  async findOne(id: number) {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  // ======================
  // CREATE (parentId)
  // ======================
  async create(dto: CreateMenuDto) {
    let parent: Menu | null = null;

    if (dto.parentId !== undefined) {
      parent = await this.menuRepo.findOneBy({ id: dto.parentId });

      if (!parent) {
        throw new NotFoundException('Parent menu not found');
      }
    }

    const menu = this.menuRepo.create({
      title: dto.title,
      url: dto.url,
      parent,
    });

    return this.menuRepo.save(menu);
  }

  // ======================
  // UPDATE (parent_id)
  // ======================
  async update(id: number, dto: UpdateMenuDto) {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    // update basic fields
    if (dto.title !== undefined) {
      menu.title = dto.title;
    }

    if (dto.url !== undefined) {
      menu.url = dto.url;
    }

    // update parent (snake_case)
    if (dto.parent_id !== undefined) {
      if (dto.parent_id === null) {
        menu.parent = null;
      } else {
        if (dto.parent_id === id) {
          throw new BadRequestException(
            'Menu cannot be parent of itself',
          );
        }

        const parent = await this.menuRepo.findOneBy({
          id: dto.parent_id,
        });

        if (!parent) {
          throw new NotFoundException('Parent menu not found');
        }

        menu.parent = parent;
      }
    }

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
  // MOVE (newParentId)
  // ======================
  async move(id: number, newParentId: number | null) {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    if (newParentId === null) {
      menu.parent = null;
    } else {
      if (newParentId === id) {
        throw new BadRequestException(
          'Menu cannot be parent of itself',
        );
      }

      const newParent = await this.menuRepo.findOneBy({
        id: newParentId,
      });

      if (!newParent) {
        throw new NotFoundException('Parent menu not found');
      }

      menu.parent = newParent;
    }

    return this.menuRepo.save(menu);
  }

  // ======================
  // REORDER
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
