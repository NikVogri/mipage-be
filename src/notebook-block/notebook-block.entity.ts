import { Notebook } from '../notebook/notebook.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotebookBlockType {
  image = 'image',
  richText = 'richText',
  code = 'code',
}

@Entity()
export class NotebookBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, enum: NotebookBlockType })
  type: NotebookBlockType;

  @Column({ nullable: true })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Notebook, (notebook) => notebook.blocks, {
    onDelete: 'CASCADE',
  })
  notebook: Notebook;
}
