import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItemCommentRepository } from './todo-item-comment.repository';
import { TodoItemCommentService } from './todo-item-comment.service';
import { TodoItemCommentController } from './todo-item-comment.controller';
import { FindTodoItemMiddleware } from 'src/middleware/get-todo-item.middleware';
import { TodoItemService } from 'src/todo-item/todo-item.service';
import { TodoItemRepository } from 'src/todo-item/todo-item.repository';
import { PagesModule } from 'src/page/page.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoItemCommentRepository, TodoItemRepository]),
    PagesModule,
    NotificationModule,
  ],
  providers: [TodoItemCommentService, TodoItemService],
  controllers: [TodoItemCommentController],
})
export class TodoItemCommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindTodoItemMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*/todo-items/:todoItemId/*',
    });
  }
}
