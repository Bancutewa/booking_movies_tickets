import { Ticket } from 'src/tickets/tickets.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column({ type: 'int', nullable: true })
  ticket_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'enum', enum: ['mock', 'stripe'], nullable: false })
  payment_method: 'mock' | 'stripe';

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  })
  status: 'pending' | 'success' | 'failed';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Ticket, (ticket) => ticket.payments)
  ticket: Ticket;
}
