import { Seat } from 'src/seats/seats.entity';
import { Showtime } from 'src/showtimes/showtimes.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  total_seats: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Showtime, (showtime) => showtime.room)
  showtimes: Showtime[];

  @OneToMany(() => Seat, (seat) => seat.room)
  seats: Seat[];
}
