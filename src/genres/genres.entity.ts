import { Movie } from 'src/movies/movies.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn()
  genre_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  @JoinTable({
    name: 'genre_movies',
    joinColumns: [
      {
        name: 'genre_id',
        referencedColumnName: 'genre_id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'movie_id',
        referencedColumnName: 'movie_id',
      },
    ],
  })
  movies: Movie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
