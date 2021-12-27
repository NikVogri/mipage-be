import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { extractIdFromPath } from 'src/helpers/extractIdFromPath';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/notification.entity';

type RequestWithPage = Request & { notification?: Notification };

@Injectable()
export class FindNotificationMiddleware implements NestMiddleware {
  constructor(private notificationService: NotificationService) {}

  async use(req: RequestWithPage, _: Response, next: NextFunction) {
    const { path } = req;
    const notificationId = extractIdFromPath(path, 'notifications');

    const notification = await this.notificationService.getSingleNotification(
      notificationId,
    );

    req.notification = notification;
    next();
  }
}
