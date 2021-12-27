import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { PagesModule } from './page/page.module';
import { UserModule } from './user/user.module';
import { NotebookModule } from './notebook/notebook.module';
import { TodoModule } from './todo/todo.module';
import { TodoItemModule } from './todo-item/todo-item.module';
import { MemberModule } from './member/member.module';
import { NotebookBlockModule } from './notebook-block/notebook-block.module';
import { NotificationModule } from './notification/notification.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: process.env.STAGE !== 'prod',
        logging: process.env.STAGE !== 'prod',
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    UserModule,
    AuthModule,
    PagesModule,
    NotebookModule,
    TodoModule,
    TodoItemModule,
    MemberModule,
    NotebookBlockModule,
    NotificationModule,
    LogModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
