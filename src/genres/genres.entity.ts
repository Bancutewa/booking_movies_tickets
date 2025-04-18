import { Movie } from 'src/movies/movies.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn()
  genre_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Movie, (movie) => movie.genre)
  movies: Movie[];
}
