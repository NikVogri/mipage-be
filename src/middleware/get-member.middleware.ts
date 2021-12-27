import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { extractIdFromPath } from 'src/helpers/extractIdFromPath';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

type RequestWithPage = Request & { pageMember?: User };

@Injectable()
export class FindMemberMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: RequestWithPage, _: Response, next: NextFunction) {
    const { path } = req;
    const memberId = extractIdFromPath(path, 'members');
    const pageMember = await this.userService.getSingleUser(memberId);

    req.pageMember = pageMember;
    next();
  }
}
