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
      return await this.genreService.findAll(query);
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Genre> {
    return await this.genreService.findOne(id);
  }

  // Tạo thể loại mới
  @Post()
  async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    return await this.genreService.create(createGenreDto);
  }

  // Cập nhật thông tin thể loại
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<Genre> {
    return await this.genreService.update(updateGenreDto, id);
  }

  // Xóa thể loại
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.genreService.remove(id);
  }
}
