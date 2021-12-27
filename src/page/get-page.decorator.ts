import { entityParamDecorator, GetEntity } from 'src/helpers/getParamDecorator';

export const GetPage = entityParamDecorator(GetEntity.page);
