import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpException,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, QueryMovieDto, UpdateMovieDto } from './movies.dto';
import { Movie } from './movies.entity';

@Controller('api/v1/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Get all movies
  @Get()
  async findAll(@Query() query: QueryMovieDto): Promise<{
    success: boolean;
    total: number;
    counts: number;
    data: Movie[] | string;
  }> {
    try {
      const response = await this.moviesService.findAll(query);
      if (response.length === 0) {
        return {
          success: true,
          total: 0,
          counts: 0,
          data: 'No movies found',
        };
      }
      return {
        success: true,
        total: response.length,
        counts: response.length,
        data: response,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Server error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a single movie by ID
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; data: Movie }> {
    try {
      const response = await this.moviesService.findOne(id);
      if (!response) {
        throw new HttpException(
          {
            success: false,
            error: `Movie with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: response };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Server error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create a new movie
  @Post()
  async create(
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<{ success: boolean; data: Movie }> {
    try {
      const response = await this.moviesService.create(createMovieDto);
      return { success: true, data: response };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Server error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update a movie by ID
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<{ success: boolean; data: Movie }> {
    try {
      const response = await this.moviesService.update(id, updateMovieDto);
      if (!response) {
        throw new HttpException(
          {
            success: false,
            error: `Movie with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: response };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Server error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a movie by ID
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; data: string }> {
    try {
      await this.moviesService.remove(id);
      return { success: true, data: `Movie with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            error: `Movie with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          error: 'Server error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
