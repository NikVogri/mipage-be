import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Template, TEMPLATE } from '../models';

// Email Providers
import { SendGrid } from '../providers/sendgrid';

// Templates
import passwordResetTemplate from '../templates/password-reset.template';
import ctaNotificationTemplate from '../templates/notification.template';
import welcomeTemplate from '../templates/welcome.template';

export class EmailRetriever {
  constructor(@Inject(ConfigService) private config: ConfigService) {}

  public getEmailProvider() {
    const provider = this.config.get('EMAIL_PROVIDER');

    switch (provider) {
      case 'sendgrid':
        return new SendGrid(this.config.get('SENDGRID_API_KEY'));
      default:
        throw new Error('Email provider not supported');
    }
  }

  public retrieveTemplate<T extends object>(template: TEMPLATE): Template<T> {
    switch (template) {
      case TEMPLATE.welcome:
        return {
          stringTemplate: welcomeTemplate,
          subject: 'Welcome to Mipage',
          replacements: {} as T,
        };
      case TEMPLATE.passwordReset:
        return {
          stringTemplate: passwordResetTemplate,
          subject: 'Reset your password',
          replacements: {} as T,
        };
      case TEMPLATE.notificationWithCta:
        return {
          stringTemplate: ctaNotificationTemplate,
          subject: 'You have a notification waiting',
          replacements: {
            title: 'You have a notification waiting',
            body: 'New notification is available',
            url: 'https://mipage.net',
            url_description: 'Go to Mipage',
          } as T,
        };
      default:
        return null;
    }
  }
}
