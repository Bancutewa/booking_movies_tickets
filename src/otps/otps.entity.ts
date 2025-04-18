import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('otps')
export class OTP {
  @PrimaryGeneratedColumn()
  otp_id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @Column({ type: 'varchar', length: 6, nullable: false })
  otp_code: string;

  @Column({ type: 'datetime', nullable: false })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.otps)
  user: User;
}
