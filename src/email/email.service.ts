import { EmailProviderData, IEmailProvider, EMAIL } from './models';
import { Inject, Injectable } from '@nestjs/common';
import { EmailTemplateFormatter } from './helpers/email-template-formatter.service';
import { EmailRetriever } from './helpers/email.retriever.service';

@Injectable()
export class EmailService {
  private emailProvider: IEmailProvider;

  constructor(
    @Inject(EmailTemplateFormatter)
    private emailTemplateFormatter: EmailTemplateFormatter,
    @Inject(EmailRetriever)
    private emailRetriever: EmailRetriever,
  ) {
    this.emailProvider = this.emailRetriever.getEmailProvider();
  }

  public async sendEmail<T>(
    emailType: EMAIL,
    toEmail: string,
    replacements: Record<string, string> & T,
  ): Promise<void> {
    const emailInfo = this.emailRetriever.retrievePayloadDefaults(emailType);

    const templateString = this.emailRetriever.retrieveTemplate(emailType);
    const template = this.emailTemplateFormatter.buildHtmlTemplate(
      templateString,
      { ...emailInfo.replacements, ...replacements },
    );

    const payload: EmailProviderData = {
      toEmail: toEmail,
      subject: replacements.subject ?? emailInfo.subject,
      template: template,
    };

    await this.emailProvider.send(payload);
  }
}
