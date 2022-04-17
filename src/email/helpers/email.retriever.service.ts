import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EMAIL } from '../models';

// Email Providers
import { SendGrid } from '../providers/sendgrid';

// Templates
import passwordResetTemplate from '../templates/password-reset.template';
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

  public retrieveTemplate(emailType: EMAIL): string {
    switch (emailType) {
      case EMAIL.welcome:
        return welcomeTemplate;
      case EMAIL.passwordReset:
        return passwordResetTemplate;
      default:
        throw new Error('Template not supported');
    }
  }

  public retrievePayloadDefaults(emailType: EMAIL): {
    subject: string;
    replacements: Record<string, string>;
  } {
    switch (emailType) {
      case EMAIL.welcome:
        return {
          subject: 'Welcome to Mipage',
          replacements: {},
        };
      case EMAIL.passwordReset:
        return {
          subject: 'Reset your password',
          replacements: {},
        };
      default:
        throw new Error('Email type not supported');
    }
  }
}
