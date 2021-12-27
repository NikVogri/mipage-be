import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { extractIdFromPath } from 'src/helpers/extractIdFromPath';
import { TodoItemService } from 'src/todo-item/todo-item.service';
import { TodoItem } from 'src/todo-item/todo-item.entity';

type RequestWithPage = Request & { todoItem?: TodoItem };

@Injectable()
export class FindTodoItemMiddleware implements NestMiddleware {
  constructor(private todoItemService: TodoItemService) {}

  async use(req: RequestWithPage, _: Response, next: NextFunction) {
    const { path } = req;
    const todoItemId = extractIdFromPath(path, 'todo-items');

    const todoItem = await this.todoItemService.getSingleTodoItem(todoItemId);

    req.todoItem = todoItem;
    next();
  }
}
