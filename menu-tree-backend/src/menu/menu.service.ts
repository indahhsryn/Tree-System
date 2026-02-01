import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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
      .filter(m =>
        parentId === null ? m.parent === null : m.parent?.id === parentId,
      )
      .map(m => ({
        ...m,
        children: this.buildTree(menus, m.id),
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

    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  // ======================
  // CREATE
  // ======================
  async create(dto: CreateMenuDto) {
    let parent: Menu | null = null;

    if (dto.parentId !== undefined) {
      parent = await this.menuRepo.findOneBy({ id: dto.parentId });
      if (!parent) throw new NotFoundException('Parent menu not found');
    }

    //  order terakhir di sibling
    const lastOrder = await this.menuRepo.findOne({
      where: parent ? { parent: { id: parent.id } } : { parent: IsNull() },
      order: { order: 'DESC' },
    });

    const menu = this.menuRepo.create({
      title: dto.title,
      url: dto.url,
      parent,
      order: lastOrder ? lastOrder.order + 1 : 0,
    });

    return this.menuRepo.save(menu);
  }

  // ======================
  // UPDATE
  // ======================
  async update(id: number, dto: UpdateMenuDto) {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!menu) throw new NotFoundException('Menu not found');

    if (dto.title !== undefined) menu.title = dto.title;
    if (dto.url !== undefined) menu.url = dto.url;

    //  UPDATE PARENT (ANTI LOOP)
    if (dto.parent_id !== undefined) {
      await this.assertNoCycle(id, dto.parent_id);

      if (dto.parent_id === null) {
        menu.parent = null;
      } else {
        const parent = await this.menuRepo.findOneBy({
          id: dto.parent_id,
        });
        if (!parent) throw new NotFoundException('Parent menu not found');
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
    if (!menu) throw new NotFoundException('Menu not found');

    await this.menuRepo.remove(menu);

    //  rapikan order sibling
    await this.normalizeOrder(menu.parent?.id ?? null);

    return { message: 'Menu deleted' };
  }

  // ======================
  // MOVE (CHANGE PARENT)
  // ======================
  async move(id: number, newParentId: number | null) {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!menu) throw new NotFoundException('Menu not found');

    await this.assertNoCycle(id, newParentId);

    const oldParentId = menu.parent?.id ?? null;

    // set parent
    if (newParentId === null) {
      menu.parent = null;
    } else {
      const parent = await this.menuRepo.findOneBy({ id: newParentId });
      if (!parent) throw new NotFoundException('Parent menu not found');
      menu.parent = parent;
    }

    // set order terakhir di parent baru
    const lastOrder = await this.menuRepo.findOne({
      where: newParentId
        ? { parent: { id: newParentId } }
        : { parent: IsNull() },
      order: { order: 'DESC' },
    });

    menu.order = lastOrder ? lastOrder.order + 1 : 0;

    await this.menuRepo.save(menu);

    // rapikan sibling lama & baru
    await this.normalizeOrder(oldParentId);
    await this.normalizeOrder(newParentId);

    return menu;
  }

  // ======================
  // REORDER
  // ======================
  async reorder(id: number, newOrder: number) {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!menu) throw new NotFoundException('Menu not found');

    menu.order = newOrder;
    await this.menuRepo.save(menu);

    await this.normalizeOrder(menu.parent?.id ?? null);

    return menu;
  }

  // ======================
  //UTILITIES
  // ======================

  //  CEGAH INFINITE LOOP
  private async assertNoCycle(
    menuId: number,
    parentId: number | null,
  ) {
    if (parentId === null) return;
    if (parentId === menuId) {
      throw new BadRequestException(
        'Menu cannot be parent of itself',
      );
    }

    let current = await this.menuRepo.findOne({
      where: { id: parentId },
      relations: ['parent'],
    });

    while (current) {
      if (current.parent?.id === menuId) {
        throw new BadRequestException(
          'Menu cannot be moved under its own child',
        );
      }
      current = current.parent
        ? await this.menuRepo.findOne({
            where: { id: current.parent.id },
            relations: ['parent'],
          })
        : null;
    }
  }

  // 🔥 NORMALIZE ORDER SIBLING
  private async normalizeOrder(parentId: number | null) {
    const siblings = await this.menuRepo.find({
      where: parentId
        ? { parent: { id: parentId } }
        : { parent: IsNull() },
      order: { order: 'ASC' },
    });

    for (let i = 0; i < siblings.length; i++) {
      siblings[i].order = i;
    }

    await this.menuRepo.save(siblings);
  }
}
