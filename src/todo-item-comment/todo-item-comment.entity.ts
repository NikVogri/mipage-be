import { TodoItem } from 'src/todo-item/todo-item.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class TodoItemComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TodoItem, { onDelete: 'CASCADE' })
  todoItem: TodoItem;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;
}
