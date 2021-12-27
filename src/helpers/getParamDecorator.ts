import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export enum GetEntity {
  page = 'page',
  todo = 'todo',
  user = 'user',
  notebook = 'notebook',
  notification = 'notification',
  notebookBlock = 'notebookBlock',
  todoItem = 'todoItem',
  pageMember = 'pageMember',
}

export const entityParamDecorator = (item: GetEntity) =>
  createParamDecorator((_data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!req[item]) {
      throw new Error(
        `Did not find ${item} item in request object, did you configure ${item} middleware correctly?`,
      );
    }

    return req[item];
  });
