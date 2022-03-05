import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoItem } from 'src/todo-item/todo-item.entity';
import { User } from 'src/user/user.entity';
import { CreateTodoItemCommentDto } from './dto/create-todo-item-comment.dto';
import { TodoItemCommentRepository } from './todo-item-comment.repository';

@Injectable()
export class TodoItemCommentService {
  constructor(
    @InjectRepository(TodoItemCommentRepository)
    private todoItemRepository: TodoItemCommentRepository,
  ) {}

  async addComment(
    todoItem: TodoItem,
    author: User,
    createTodoItemCommentDto: CreateTodoItemCommentDto,
  ) {
    return await this.todoItemRepository.createComment(
      todoItem,
      author,
      createTodoItemCommentDto,
    );
  }

  async getTotalComments(todoItem: TodoItem): Promise<number> {
    return await this.todoItemRepository.count({ where: { todoItem } });
  }

  async getTodoItemComments(todoItem: TodoItem, p: string, batch: string) {
    const page = p ? parseInt(p) : 0;
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
    return res.map((c) => ({
      ...c,
      todoItem: {
        id: todoItem.id,
      },
    }));
  }
}
