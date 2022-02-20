import { Notebook } from 'src/notebook/notebook.entity';
import { Todo } from 'src/todo/todo.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PageType {
  notebook = 'notebook',
  todo = 'todo',
}

@Entity()
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  private: boolean;

  @Column({ enum: PageType, nullable: false })
  type: PageType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.ownedPages, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Todo, (todo) => todo.page)
  todos: Todo[];

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable()
  members: User[];

  @OneToMany(() => Notebook, (notebook) => notebook.page)
  notebooks: Notebook[];
}
