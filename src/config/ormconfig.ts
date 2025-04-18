import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'bacutewa10304',
  database: process.env.DB_DATABASE || 'booking_tickets_movie',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
