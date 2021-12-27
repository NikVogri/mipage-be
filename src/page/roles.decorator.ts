import { SetMetadata } from '@nestjs/common';

export type Role = 'owner' | 'member';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
