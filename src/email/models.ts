export interface EmailProviderPayload {
  toEmail: string;
  subject: string;
  template: string;
}

export abstract class IEmailProvider {
  public abstract send(data: EmailProviderPayload): Promise<void>;
}

export enum TEMPLATE {
  welcome = 'welcome',
  passwordReset = 'passwordReset',
  notificationWithCta = 'notificationWithCta',
}

export interface Template<T> {
  stringTemplate: string;
  subject: string;
  replacements: T;
}

export interface WelcomeEmailTemplateReplacers {
  username: string;
}
export interface PasswordResetEmailTemplateReplacers {
  reset_url: string;
}

export interface AddedToPageEmailTemplateReplacers {
  title: string;
  body: string;
  url: string;
  url_description: string;
}
