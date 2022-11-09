import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  async createNotification(
    user: User,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.create({
      ...createNotificationDto,
      user,
    });

    await this.save(notification);
    delete notification.user;
    return notification;
  }

  async findNotViewedNotifications(user: User): Promise<Notification[]> {
    return await this.find({
      where: {
        user,
        viewed: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markNotificationViewed(
    notification: Notification,
  ): Promise<Notification> {
    notification.viewed = true;
    notification.viewedAt = new Date();

    await this.save(notification);
    return notification;
  }
}
