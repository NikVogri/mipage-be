import { Page } from 'src/page/page.entity';
import { NotebookBlock } from '../notebook-block/notebook-block.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notebook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  banner: string;

  @Column('simple-array', { nullable: true })
  order: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Page, (page) => page.notebooks, {
    onDelete: 'CASCADE',
  })
  page: Page;

  @OneToMany(() => NotebookBlock, (notebookBlock) => notebookBlock.notebook)
  blocks: NotebookBlock[];
}
