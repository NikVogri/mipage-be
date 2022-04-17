export interface EmailProviderData {
  toEmail: string;
  subject: string;
  template: string;
}

export abstract class IEmailProvider {
  public abstract send(data: EmailProviderData): Promise<void>;
}

export enum EMAIL {
  welcome = 'welcome',
  passwordReset = 'passwordReset',
}

export interface EmailData {
  subject?: string;
}

export interface IPasswordResetEmail extends EmailData {
  username: string;
  reset_url: string;
}
