import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './genres.entity';
import { In, Like, Repository } from 'typeorm';
import { CreateGenreDto, QueryGenreDto, UpdateGenreDto } from './genres.dto';
import { Movie } from 'src/movies/movies.entity';
@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async findAll(query: QueryGenreDto): Promise<Genre[]> {
    const { page = 1, limit = 10, sort, fields, name, ...filters } = query;

    // Xác thực tham số phân trang
    const pageNum = page;
    const limitNum = limit;
    if (pageNum < 1 || limitNum < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const queryBuilder = this.genreRepository
      .createQueryBuilder('genres')
      .leftJoinAndSelect('genres.movies', 'movies');

    if (name) {
      queryBuilder.andWhere('genres.name LIKE :name', { name: `%${name}%` });
    }

    // Áp dụng bộ lọc
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (typeof value === 'string') {
        queryBuilder.andWhere(`genres.${key} LIKE :${key}`, {
          [key]: `%${value}%`,
        });
      } else {
        queryBuilder.andWhere(`genres.${key} = :${key}`, { [key]: value });
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
        queryBuilder.addOrderBy(`genres.${field}`, direction);
      });
    } else {
      queryBuilder.orderBy('genres.createdAt', 'DESC');
    }

    // Nếu có trường fields, chỉ chọn các trường đó
    // và thêm lại quan hệ movies để lấy thông tin phim liên quan
    if (fields) {
      const selectedFields = fields
        .split(',')
        .map((field: string) => field.trim())
        .map((field: string) => `genres.${field}`);
      queryBuilder.select(selectedFields);
      // Thêm lại quan hệ movies nếu chọn trường
      queryBuilder.leftJoinAndSelect('genres.movies', 'movies');
    }

    // Phân trang
    const skip = (pageNum - 1) * limitNum;
    queryBuilder.skip(skip).take(limitNum);

    // Thực thi truy vấn
    const [genres, total] = await queryBuilder.getManyAndCount();

    return genres;
  }

  async findOne(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { genre_id: id },
    });
    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return genre;
  }

  async create(createGenreBody: CreateGenreDto): Promise<Genre> {
    const { name, description } = createGenreBody;

    const existingGenre = await this.genreRepository.findOne({
      where: { name },
    });

    if (existingGenre) {
      throw new BadRequestException(`Genre with name ${name} already exists`);
    }

    const genre = this.genreRepository.create({
      name,
      description,
    });

    return this.genreRepository.save(genre);
  }

  async update(updateGenreDto: UpdateGenreDto, id: number): Promise<Genre> {
    const genreUpdate = await this.genreRepository.findOne({
      where: { genre_id: id },
      relations: ['movies'],
    });
    if (!genreUpdate) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    const { name, description, movies } = updateGenreDto;

    if (name && name !== genreUpdate.name) {
      const existingGenre = await this.genreRepository.findOne({
        where: { name },
      });
      if (existingGenre && existingGenre.genre_id !== id) {
        throw new BadRequestException(`Genre with name ${name} already exists`);
      }
      genreUpdate.name = name;
    }

    if (description !== undefined) {
      genreUpdate.description = description;
    }

    if (movies !== undefined) {
      const movieEntities = await this.movieRepository.find({
        where: { movie_id: In(movies) },
      });
      const foundIds = movieEntities.map((movie) => movie.movie_id);
      const notFoundIds = movies.filter((id) => !foundIds.includes(id));
      if (notFoundIds.length > 0) {
        throw new NotFoundException(
          `Movies with ids ${notFoundIds.join(', ')} not found`,
        );
      }
      genreUpdate.movies = movieEntities;
    }
    return await this.genreRepository.save(genreUpdate);
  }

  async remove(id: number): Promise<void> {
    const genre = await this.genreRepository.findOne({
      where: { genre_id: id },
    });
    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    await this.genreRepository.delete(id);
  }
}
