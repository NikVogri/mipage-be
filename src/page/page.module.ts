import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageRepository } from './page.repository';
import { PagesController } from './page.controller';
import { PageService } from './page.service';
import { FindPageMiddleware } from 'src/middleware/get-page.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([PageRepository])],
  providers: [PageService],
  controllers: [PagesController],
})
export class PagesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FindPageMiddleware)
      .forRoutes({ method: RequestMethod.ALL, path: '/pages/:pageId*' });
  }
}
