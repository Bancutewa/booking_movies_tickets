import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/ormconfig';
import { UsersModule } from './users/users.module';
import { RatingsModule } from './ratings/ratings.module';
import { TicketsModule } from './tickets/tickets.module';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { RoomsModule } from './rooms/rooms.module';
import { SeatsModule } from './seats/seats.module';
import { PaymentsModule } from './payments/payments.module';
import { OtpsModule } from './otps/otps.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    RatingsModule,
    TicketsModule,
    MoviesModule,
    GenresModule,
    ShowtimesModule,
    RoomsModule,
    SeatsModule,
    PaymentsModule,
    OtpsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
