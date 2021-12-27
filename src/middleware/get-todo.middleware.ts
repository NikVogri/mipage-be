import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { extractIdFromPath } from 'src/helpers/extractIdFromPath';
import { Todo } from 'src/todo/todo.entity';
import { TodoService } from 'src/todo/todo.service';

type RequestWithPage = Request & { todo?: Todo };

@Injectable()
export class FindTodoMiddleware implements NestMiddleware {
  constructor(private todoService: TodoService) {}

  async use(req: RequestWithPage, _: Response, next: NextFunction) {
    const { path } = req;
    const todoId = extractIdFromPath(path, 'todos');

    const todo = await this.todoService.getSingleTodo(todoId);

    req.todo = todo;
    next();
  }
}
