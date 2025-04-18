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
  NotFoundException,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { GenreService } from './genres.service';
import { CreateGenreDto, QueryGenreDto, UpdateGenreDto } from './genres.dto';
import { Genre } from './genres.entity';

@Controller('api/v1/genres')
export class GenresController {
  constructor(private readonly genreService: GenreService) {}

  // Lấy danh sách tất cả thể loại
  @Get()
  async findAll(@Query() query: QueryGenreDto): Promise<{
    success: boolean;
    total: number;
    counts: number;
    data: Genre[] | string;
  }> {
    try {
      const response = await this.genreService.findAll(query);
      if (response.length === 0) {
        return {
          success: true,
          total: 0,
          counts: 0,
          data: 'No genres found',
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

  // Lấy thông tin một thể loại theo ID
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; data: Genre }> {
    const response = await this.genreService.findOne(id);
    try {
      if (!response) {
        throw new NotFoundException(`Genre with ID ${id} not found`);
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

  // Tạo thể loại mới
  @Post()
  async create(
    @Body() createGenreDto: CreateGenreDto,
  ): Promise<{ success: boolean; data: Genre }> {
    const response = await this.genreService.create(createGenreDto);
    try {
      if (!response) {
        throw new HttpException(
          {
            success: false,
            error: 'Server error',
            message: 'Failed to create genre',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
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

  // Cập nhật thông tin thể loại
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<{ success: boolean; data: Genre }> {
    const response = await this.genreService.update(updateGenreDto, id);
    try {
      if (!response) {
        throw new NotFoundException(`Genre with ID ${id} not found`);
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

  // Xóa thể loại
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; data: string }> {
    const response = await this.genreService.remove(id);
    try {
      if (response === undefined) {
        throw new NotFoundException(`Genre with ID ${id} not found`);
      }
      return { success: true, data: `Genre with ID ${id} has been deleted` };
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
}
