import { User } from 'src/user/user.entity';
import {
  Entity,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class ResetPasswordToken {
  @PrimaryColumn()
  token: string;

  @OneToOne(() => User)
  @Column({ nullable: false, unique: true })
  userId: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;
}
