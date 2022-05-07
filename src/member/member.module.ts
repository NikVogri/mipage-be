import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { FindMemberMiddleware } from 'src/middleware/get-member.middleware';
import { NotificationRepository } from 'src/notification/notification.repository';
import { NotificationService } from 'src/notification/notification.service';
import { PagesModule } from 'src/page/page.module';
import { PageRepository } from 'src/page/page.repository';
import { UserRespository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRespository,
      NotificationRepository,
      PageRepository,
    ]),
    PagesModule,
    EmailModule,
  ],
  providers: [MemberService, NotificationService, UserService],
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
