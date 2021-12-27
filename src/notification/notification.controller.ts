import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { GetNotification } from './get-notification.decorator';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNotifications(@GetUser() user: User) {
    return this.notificationService.getNotifications(user);
  }

  @Patch(':notificationId')
  @UseGuards(JwtAuthGuard)
  async markNotificationViewed(
    @GetNotification() notification: Notification,
    @GetUser() user: User,
  ) {
    console.log(notification, user);
    return this.notificationService.markNotificationViewed(notification, user);
  }
}
