import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindNotebookMiddleware } from 'src/middleware/get-notebok.middleware';
import { PageRepository } from 'src/page/page.repository';
import { PageService } from 'src/page/page.service';
import { NotebookController } from './notebook.controller';
import { NotebookRepository } from './notebook.repository';
import { NotebookService } from './notebook.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotebookRepository, PageRepository])],
  providers: [NotebookService, PageService],
  controllers: [NotebookController],
})
export class NotebookModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindNotebookMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*notebooks/:notebookId*',
    });
  }
}
