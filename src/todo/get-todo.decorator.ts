import { entityParamDecorator, GetEntity } from 'src/helpers/getParamDecorator';

export const GetTodo = entityParamDecorator(GetEntity.todo);
