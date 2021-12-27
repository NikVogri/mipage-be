import { entityParamDecorator, GetEntity } from 'src/helpers/getParamDecorator';

export const GetTodoItem = entityParamDecorator(GetEntity.todoItem);
