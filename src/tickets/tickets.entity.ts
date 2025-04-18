import { Payment } from 'src/payments/payments.entity';
import { Seat } from 'src/seats/seats.entity';
import { Showtime } from 'src/showtimes/showtimes.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  ticket_id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @Column({ type: 'int', nullable: true })
  showtime_id: number;

  @Column({ type: 'int', nullable: true })
  seat_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  qr_code: string;

  @Column({ type: 'enum', enum: ['active', 'cancelled'], default: 'active' })
  status: 'active' | 'cancelled';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.tickets, { nullable: true })
  user: User;

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets)
  showtime: Showtime;

  @ManyToOne(() => Seat, (seat) => seat.tickets)
  seat: Seat;

  @OneToMany(() => Payment, (payment) => payment.ticket)
  payments: Payment[];
}
