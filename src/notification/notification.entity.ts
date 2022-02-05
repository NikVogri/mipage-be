import { User } from 'src/user/user.entity';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';

export enum NotificationType {
  ADDED_TO_PAGE = 'ADDED_TO_PAGE',
  REMOVED_FROM_PAGE = 'REMOVED_FROM_PAGE',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: false })
  viewed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  viewedAt: Date;

  @Column()
  userId: string;

  @Column('jsonb', { nullable: true })
  additionalData: object;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
