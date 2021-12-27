import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PageService } from 'src/page/page.service';
import { NotebookBlockService } from './notebook-block.service';
import { NotebookService } from 'src/notebook/notebook.service';
import { NotebookBlockController } from './notebook-block.controller';
import { NotebookRepository } from 'src/notebook/notebook.repository';
import { PageRepository } from 'src/page/page.repository';
import { NotebookBlockRepository } from './notebook-block.repository';
import { FindNotebookBlockMiddleware } from 'src/middleware/get-notebook-block.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotebookBlockRepository,
      NotebookRepository,
      PageRepository,
    ]),
  ],
  providers: [NotebookBlockService, PageService, NotebookService],
  controllers: [NotebookBlockController],
})
export class NotebookBlockModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindNotebookBlockMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*/notebook-blocks/:noteblockId',
    });
  }
}
