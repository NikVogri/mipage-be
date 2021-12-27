import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { extractIdFromPath } from 'src/helpers/extractIdFromPath';
import { Notebook } from 'src/notebook/notebook.entity';
import { NotebookService } from 'src/notebook/notebook.service';

type RequestWithPage = Request & { notebook?: Notebook };

@Injectable()
export class FindNotebookMiddleware implements NestMiddleware {
  constructor(private notebookService: NotebookService) {}

  async use(req: RequestWithPage, _: Response, next: NextFunction) {
    const { path } = req;
    const notebookId = extractIdFromPath(path, 'notebooks');
    const notebook = await this.notebookService.getSingleNotebook(notebookId);

    req.notebook = notebook;
    next();
  }
}
