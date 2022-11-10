import { Page } from 'src/page/page.entity';
import { TodoItem } from '../todo-item/todo-item.entity';
import {
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ default: '#cecece' })
  color: string;

  @Column()
  pageId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Page, (page) => page.todos, {
    onDelete: 'CASCADE',
  })
  page: Page;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.todo)
  items: TodoItem[];
}
