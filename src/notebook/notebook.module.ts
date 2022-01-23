import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindNotebookMiddleware } from 'src/middleware/get-notebok.middleware';
import { NotebookBlockRepository } from 'src/notebook-block/notebook-block.repository';
import { NotebookBlockService } from 'src/notebook-block/notebook-block.service';
import { PagesModule } from 'src/page/page.module';
import { NotebookController } from './notebook.controller';
import { NotebookRepository } from './notebook.repository';
import { NotebookService } from './notebook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotebookRepository, NotebookBlockRepository]),
    forwardRef(() => PagesModule),
  ],
  providers: [NotebookService, NotebookBlockService],
  controllers: [NotebookController],
  exports: [NotebookService],
})
export class NotebookModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindNotebookMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*notebooks/:notebookId*',
    });
  }
}
