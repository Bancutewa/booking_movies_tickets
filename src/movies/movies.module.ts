import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { Genre } from 'src/genres/genres.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])], // Add your entities here
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
