import { Genre } from 'src/genres/genres.entity';
import { Rating } from 'src/ratings/ratings.entity';
import { Showtime } from 'src/showtimes/showtimes.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  movie_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  duration: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  poster_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres: Genre[];

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];
}
