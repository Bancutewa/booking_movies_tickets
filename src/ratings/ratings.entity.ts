import { Movie } from 'src/movies/movies.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  rating_id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @Column({ type: 'int', nullable: true })
  movie_id: number;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.ratings, { nullable: true })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.ratings)
  movie: Movie;
}
