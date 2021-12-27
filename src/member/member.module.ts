import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindMemberMiddleware } from 'src/middleware/get-member.middleware';
import { NotificationRepository } from 'src/notification/notification.repository';
import { NotificationService } from 'src/notification/notification.service';
import { PageRepository } from 'src/page/page.repository';
import { PageService } from 'src/page/page.service';
import { UserRespository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRespository,
      PageRepository,
      NotificationRepository,
    ]),
  ],
  providers: [MemberService, PageService, NotificationService, UserService],
  controllers: [MemberController],
})
export class MemberModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindMemberMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*/members/*',
    });
  }
}
