import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindTodoMiddleware } from 'src/middleware/get-todo.middleware';
import { PagesModule } from 'src/page/page.module';
import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoRepository]), PagesModule],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindTodoMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*todos/:todoId*',
    });
  }
}
