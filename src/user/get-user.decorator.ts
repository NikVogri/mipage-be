import { entityParamDecorator, GetEntity } from 'src/helpers/getParamDecorator';

export const GetUser = entityParamDecorator(GetEntity.user);
