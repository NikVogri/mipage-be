import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { extractIdFromPath } from 'src/helpers/extractIdFromPath';
import { NotebookBlock } from 'src/notebook-block/notebook-block.entity';
import { NotebookBlockService } from 'src/notebook-block/notebook-block.service';

type RequestWithPage = Request & { notebookBlock?: NotebookBlock };

@Injectable()
export class FindNotebookBlockMiddleware implements NestMiddleware {
  constructor(private notebookBlockService: NotebookBlockService) {}

  async use(req: RequestWithPage, _: Response, next: NextFunction) {
    const { path } = req;
    const notebookBlockId = extractIdFromPath(path, 'notebook-blocks');
    const notebookBlock =
      await this.notebookBlockService.getSingleNotebookBlock(notebookBlockId);

    req.notebookBlock = notebookBlock;
    next();
  }
}
