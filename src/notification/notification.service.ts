import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './notification.entity';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private notificationRepository: NotificationRepository,
  ) {}

  async createNotification(
    user: User,
    createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationRepository.createNotification(
      user,
      createNotificationDto,
    );
  }

  async getNotifications(user: User) {
    return await this.notificationRepository.findNotViewedNotifications(user);
  }

  async getSingleNotification(notificationId: string) {
    const notification = await this.notificationRepository.findOne(
      notificationId,
      {
        relations: ['user'],
      },
    );

    console.log('here', notification);

    if (!notification) {
      throw new BadRequestException(
        `Notification with the id ${notificationId} was not found`,
      );
    }

    return notification;
  }

  async markNotificationViewed(notification: Notification, user: User) {
    if (notification.user.id !== user.id) {
      throw new ForbiddenException(
        `You can't mark this notification as viewed`,
      );
    }

    if (notification.viewed) {
      throw new BadRequestException(
        `This notification has already been viewed`,
      );
    }

    await this.notificationRepository.markNotificationViewed(notification);
  }
}
