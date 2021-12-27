import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PageService } from '../page.service';
import { Role } from '../roles.decorator';

@Injectable()
export class PageRolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private pageService: PageService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(
      'roles',
      ctx.getHandler(),
    ) as Role[];

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    const pageId = req.params.pageId;

    const page = await this.pageService.getSinglePage(pageId);

    let isAllowed = false;
    for (const role of roles) {
      switch (role) {
        case 'owner':
          isAllowed = page.owner.id === user.id;
          break;
        case 'member':
          isAllowed = page.members.some((member) => member.id === user.id);
          break;
      }

      if (isAllowed) {
        return true;
      }
    }

    if (!isAllowed) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
  }
}
