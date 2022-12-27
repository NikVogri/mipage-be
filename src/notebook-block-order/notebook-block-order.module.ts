import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindNotebookMiddleware } from 'src/middleware/get-notebok.middleware';
import { NotebookBlockRepository } from 'src/notebook-block/notebook-block.repository';
import { NotebookRepository } from 'src/notebook/notebook.repository';
import { NotebookService } from 'src/notebook/notebook.service';
import { PagesModule } from 'src/page/page.module';
import { NotebookBlockOrderController } from './notebook-block-order.controller';
import { NotebookBlockOrderService } from './notebook-block-order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotebookRepository, NotebookBlockRepository]),
    forwardRef(() => PagesModule),
  ],
  providers: [NotebookBlockOrderService, NotebookService],
  controllers: [NotebookBlockOrderController],
})
export class NotebookBlockOrderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindNotebookMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*notebooks/:notebookId*',
    });
  }
}
