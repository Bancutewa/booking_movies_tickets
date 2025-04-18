import { Movie } from 'src/movies/movies.entity';
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

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn()
  showtime_id: number;

  @Column({ type: 'int', nullable: true })
  movie_id: number;

  @Column({ type: 'int', nullable: true })
  room_id: number;

  @Column({ type: 'datetime', nullable: false })
  start_time: Date;

  @Column({ type: 'datetime', nullable: false })
  end_time: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie;

  @ManyToOne(() => Room, (room) => room.showtimes)
  room: Room;

  @OneToMany(() => Ticket, (ticket) => ticket.showtime)
  tickets: Ticket[];
}
