import { Room } from 'src/rooms/rooms.entity';
import { Ticket } from 'src/tickets/tickets.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn()
  seat_id: number;

  @Column({ type: 'int', nullable: true })
  room_id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  seat_number: string;

  @Column({
    type: 'enum',
    enum: ['available', 'reserved', 'booked'],
    default: 'available',
  })
  status: 'available' | 'reserved' | 'booked';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Room, (room) => room.seats)
  room: Room;

  @OneToMany(() => Ticket, (ticket) => ticket.seat)
  tickets: Ticket[];
}
