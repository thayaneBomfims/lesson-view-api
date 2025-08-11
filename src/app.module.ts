import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudentsModule } from './app/students/students.module';
import { ClassesModule } from './app/class/classes.module';
import { WeekTimeModule } from './app/week-time/week-time.module';
import { ResponsibleModule } from './app/responsible/responsible.module';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
      ({
        type: configService.get<'postgres'>('TYPEORM_CONNECTION', 'postgres'),
        host: configService.get('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 5432)),
        username: configService.get('DB_USERNAME', 'lesson'),
        password: configService.get('DB_PASSWORD', 'lesson'),
        database: configService.get('DB_DATABASE', 'lesson_view'),
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
        synchronize: true,
        ssl: false,
      } as TypeOrmModuleOptions),
    }),

    StudentsModule,
    ClassesModule,
    WeekTimeModule,
    ResponsibleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
