import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenreService } from './genres.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './genres.entity';
import { Movie } from 'src/movies/movies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Genre, Movie])],
  controllers: [GenresController],
  providers: [GenreService],
})
export class GenresModule {}
