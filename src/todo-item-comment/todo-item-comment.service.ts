import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from 'src/notification/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Page } from 'src/page/page.entity';
import { TodoItem } from 'src/todo-item/todo-item.entity';
import { User } from 'src/user/user.entity';
import { CreateTodoItemCommentDto } from './dto/create-todo-item-comment.dto';
import { TodoItemCommentRepository } from './todo-item-comment.repository';

@Injectable()
export class TodoItemCommentService {
  constructor(
    @InjectRepository(TodoItemCommentRepository)
    private todoItemRepository: TodoItemCommentRepository,
    private notificationService: NotificationService,
  ) {}

  async addComment(
    todoItem: TodoItem,
    author: User,
    page: Page,
    createTodoItemCommentDto: CreateTodoItemCommentDto,
  ) {
    const comment = await this.todoItemRepository.createComment(
      todoItem,
      author,
      createTodoItemCommentDto,
    );

    if (todoItem.creator.id !== author.id) {
      await this.notificationService.createNotification(todoItem.creator, {
        type: NotificationType.USER_ADDED_COMMENT,
        title: 'New comment on your todo item',
        body: `${author.username} added a comment on your todo item`,
        additionalData: {
          pageId: page.id,
          todoId: todoItem.todoId,
          todoItemId: todoItem.id,
          commentId: comment.id,
        },
      });
    }

    return comment;
  }

  async getTotalComments(todoItem: TodoItem): Promise<number> {
    return await this.todoItemRepository.count({ where: { id: todoItem.id } });
  }

  async getTodoItemComments(
    todoItem: TodoItem,
    pageNum: string,
    batch: string,
  ) {
    const page = pageNum ? parseInt(pageNum) : 0;
    let pageSize = batch ? parseInt(batch) : 10;

    // Limit to max 25 comments per request
    if (pageSize > 25) {
      pageSize = 25;
    }

    const res = await this.todoItemRepository.findItemsWithPagination(
      todoItem,
      page,
      pageSize,
    );

    // add todoItem id to each item to avoid another DB relations query
    return res.map((comment) => ({
      ...comment,
      todoItem: {
        id: todoItem.id,
      },
    }));
  }
}
