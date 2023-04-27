import { EmailProviderPayload, IEmailProvider } from '../models';
import { InternalServerErrorException } from '@nestjs/common';

import axios from 'axios';

export class SendInBlue implements IEmailProvider {
  constructor(private apiKey: string) {}

  private apiUrl = 'https://api.sendinblue.com/v3';

  private buildPayload(data: EmailProviderPayload) {
    return {
      subject: data.subject,
      sender: { email: 'noreply@mipage.net', name: 'Mipage' },
      to: [{ email: data.toEmail }],
      htmlContent: data.template,
    };
  }

  async send(data: EmailProviderPayload): Promise<void> {
    const payload = this.buildPayload(data);

    await axios.post(`${this.apiUrl}/smtp/email`, payload, {
      headers: {
        ['api-key']: this.apiKey,
      },
    });
  }
}
