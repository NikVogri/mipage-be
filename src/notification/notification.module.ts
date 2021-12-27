import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindNotificationMiddleware } from 'src/middleware/get-notification.middleware';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationRepository])],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FindNotificationMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '/notifications/*',
    });
  }
}
