import {
  EmailProviderPayload,
  IEmailProvider,
  TEMPLATE,
  WelcomeEmailTemplateReplacers,
  PasswordResetEmailTemplateReplacers,
  AddedToPageEmailTemplateReplacers,
} from './models';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmailTemplateFormatter } from './helpers/email-template-formatter.service';
import { EmailRetriever } from './helpers/email.retriever.service';
import { LogService } from 'src/log/log.service';

@Injectable()
export class EmailService {
  private emailProvider: IEmailProvider;

  constructor(
    @Inject(EmailTemplateFormatter)
    private emailTemplateFormatter: EmailTemplateFormatter,
    @Inject(EmailRetriever)
    private emailRetriever: EmailRetriever,
    @Inject(LogService)
    private logService: LogService,
  ) {
    this.emailProvider = this.emailRetriever.getEmailProvider();
  }

  private async sendEmail(
    toEmail: string,
    subject: string,
    template: string,
  ): Promise<void> {
    const payload: EmailProviderPayload = {
      toEmail: toEmail,
      subject: subject,
      template: template,
    };

    try {
      await this.emailProvider.send(payload);
    } catch (err) {
      this.logService.logError(err).save();
      throw new InternalServerErrorException();
    }
  }

  async sendWelcome(toEmail: string, username: string): Promise<void> {
    const template =
      this.emailRetriever.retrieveTemplate<WelcomeEmailTemplateReplacers>(
        TEMPLATE.welcome,
      );

    template.replacements.username = username;

    const htmlTemplate = this.emailTemplateFormatter.buildHtmlTemplate(
      template.stringTemplate,
      template.replacements,
    );

    await this.sendEmail(toEmail, template.subject, htmlTemplate);
  }

  async sendPasswordReset(toEmail: string, resetUrl: string): Promise<void> {
    const template =
      this.emailRetriever.retrieveTemplate<PasswordResetEmailTemplateReplacers>(
        TEMPLATE.passwordReset,
      );

    template.replacements.reset_url = resetUrl;

    const htmlTemplate = this.emailTemplateFormatter.buildHtmlTemplate(
      template.stringTemplate,
      template.replacements,
    );

    await this.sendEmail(toEmail, template.subject, htmlTemplate);
  }

  async sendAddedToPage(
    toEmail: string,
    url: string,
    { title, body }: { title?: string; body?: string } = {},
  ): Promise<void> {
    const template =
      this.emailRetriever.retrieveTemplate<AddedToPageEmailTemplateReplacers>(
        TEMPLATE.notificationWithCta,
      );

    if (title) template.replacements.title = title;
    if (body) template.replacements.body = body;
    template.replacements.url = url;
    template.replacements.url_description = 'Visit the page now';

    const htmlTemplate = this.emailTemplateFormatter.buildHtmlTemplate(
      template.stringTemplate,
      template.replacements,
    );

    await this.sendEmail(toEmail, template.subject, htmlTemplate);
  }
}
