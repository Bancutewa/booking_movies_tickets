import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { In, Repository } from 'typeorm';
import { CreateMovieDto, QueryMovieDto, UpdateMovieDto } from './movies.dto';
import { Genre } from 'src/genres/genres.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async findAll(query: QueryMovieDto): Promise<Movie[]> {
    const { page = 1, limit = 10, sort, fields, title, ...filters } = query;

    // Xác thực tham số phân trang
    const pageNum = page;
    const limitNum = limit;
    if (pageNum < 1 || limitNum < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const queryBuilder = this.movieRepository.createQueryBuilder('movies');

    if (title) {
      queryBuilder.andWhere('movies.title LIKE :title', {
        title: `%${title}%`,
      });
    }

    // Áp dụng bộ lọc
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (typeof value === 'string') {
        queryBuilder.andWhere(`movies.${key} LIKE :${key}`, {
          [key]: `%${value}%`,
        });
      } else {
        queryBuilder.andWhere(`movies.${key} = :${key}`, { [key]: value });
      }
    });

    if (sort) {
      // ex sort=-name,createdAt
      const sortFields = sort.split(',').map((s: string) => s.trim());
      sortFields.forEach((sortField: string) => {
        const direction = sortField.startsWith('-') ? 'DESC' : 'ASC';
        const field = sortField.startsWith('-')
          ? sortField.slice(1)
          : sortField;
        queryBuilder.addOrderBy(`movies.${field}`, direction as 'ASC' | 'DESC');
      });
    }

    // Chọn các trường cụ thể nếu có
    if (fields) {
      const selectedFields = fields.split(',').map((f: string) => f.trim());
      queryBuilder.select(selectedFields.map((field) => `movies.${field}`));
    }

    // Phân trang
    queryBuilder.skip((pageNum - 1) * limitNum).take(limitNum);

    const [movies, total] = await queryBuilder.getManyAndCount();
    return movies;
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { movie_id: id },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return movie;
  }

  async create(createMovieBody: CreateMovieDto): Promise<Movie> {
    const { title, description, duration, poster_url, genres } =
      createMovieBody;

    const existingMovie = await this.movieRepository.findOne({
      where: { title },
    });
    if (existingMovie) {
      throw new BadRequestException('Movie already exists');
    }
    const newMovie = this.movieRepository.create({
      title,
      description,
      duration,
      poster_url,
    });
    if (genres !== undefined) {
      const genreEntities = await this.genreRepository.findBy({
        genre_id: In(genres),
      });
      const foundGenreIds = genreEntities.map((genre) => genre.genre_id);
      const notFoundGenreIds = genres.filter(
        (id) => !foundGenreIds.includes(id),
      );
      if (notFoundGenreIds.length > 0) {
        throw new BadRequestException(
          `Genres with IDs ${notFoundGenreIds.join(', ')} not found`,
        );
      }
      newMovie.genres = genreEntities;
    }
    return this.movieRepository.save(newMovie);
  }
  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { movie_id: id },
      relations: ['genres'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    const { title, description, duration, poster_url, genres } = updateMovieDto;

    if (title && title !== movie.title) {
      const existingMovie = await this.movieRepository.findOne({
        where: { title },
      });
      if (existingMovie && existingMovie.movie_id !== id) {
        throw new BadRequestException(
          `Movie with title "${title}" already exists`,
        );
      }
      movie.title = title;
    }

    if (description !== undefined) {
      movie.description = description;
    }

    if (duration !== undefined) {
      movie.duration = duration;
    }

    if (poster_url !== undefined) {
      movie.poster_url = poster_url;
    }

    if (genres !== undefined) {
      const genreEntities = await this.genreRepository.findBy({
        genre_id: In(genres),
      });
      const foundGenreIds = genreEntities.map((genre) => genre.genre_id);
      const notFoundGenreIds = genres.filter(
        (id) => !foundGenreIds.includes(id),
      );
      if (notFoundGenreIds.length > 0) {
        throw new BadRequestException(
          `Genres with IDs ${notFoundGenreIds.join(', ')} not found`,
        );
      }
      movie.genres = genreEntities;
    }

    return this.movieRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.movieRepository.findOne({
      where: { movie_id: id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    await this.movieRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.movieRepository.clear();
  }

  async removeByIds(ids: number[]): Promise<void> {
    await this.movieRepository.delete(ids);
  }
}
