import { entityParamDecorator, GetEntity } from 'src/helpers/getParamDecorator';

export const GetMember = entityParamDecorator(GetEntity.pageMember);
