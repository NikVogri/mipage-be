import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Todo } from '../todo/todo.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  completed: boolean;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  todoId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @ManyToOne(() => Todo, (todo) => todo.items, { onDelete: 'CASCADE' })
  todo: Todo;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  creator: User;
}
