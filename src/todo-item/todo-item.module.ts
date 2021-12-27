import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindTodoItemMiddleware } from 'src/middleware/get-todo-item.middleware';
import { PageRepository } from 'src/page/page.repository';
import { PageService } from 'src/page/page.service';
import { TodoRepository } from 'src/todo/todo.repository';
import { TodoService } from 'src/todo/todo.service';
import { TodoItemController } from './todo-item.controller';
import { TodoItemRepository } from './todo-item.repository';
import { TodoItemService } from './todo-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TodoItemRepository,
      TodoRepository,
      PageRepository,
    ]),
  ],
  providers: [TodoItemService, TodoService, PageService],
  controllers: [TodoItemController],
})
export class TodoItemModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindTodoItemMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*/todo-items/:todoItemId',
    });
  }
}
