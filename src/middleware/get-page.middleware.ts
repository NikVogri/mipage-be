import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { extractIdFromPath } from 'src/helpers/extractIdFromPath';
import { Page } from 'src/page/page.entity';
import { PageService } from 'src/page/page.service';

type RequestWithPage = Request & { page?: Page };

@Injectable()
export class FindPageMiddleware implements NestMiddleware {
  constructor(private pageService: PageService) {}

  async use(req: RequestWithPage, _: Response, next: NextFunction) {
    const { path } = req;
    const pageId = extractIdFromPath(path, 'pages');

    const page = await this.pageService.getPage(pageId);
    req.page = page;
    next();
  }
}
