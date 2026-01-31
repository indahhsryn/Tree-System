import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  url: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Menu, (menu) => menu.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu | null;  
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];
}
