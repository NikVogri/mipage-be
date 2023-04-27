import { EmailProviderPayload, IEmailProvider } from '../models';
import { InternalServerErrorException } from '@nestjs/common';

import axios from 'axios';

export class SendGrid implements IEmailProvider {
  constructor(private apiKey: string) {}

  private apiUrl = 'https://api.sendgrid.com/v3';

  private buildPayload(data: EmailProviderPayload) {
    return {
      personalizations: [
        {
          to: [
            {
              email: data.toEmail,
            },
          ],
        },
      ],
      from: {
        email: 'no-reply@mipage.net',
        name: 'Mipage',
      },
      subject: data.subject,
      content: [
        {
          type: 'text/html',
          value: data.template,
        },
      ],
      sendAt: Date.now(),
    };
  }

  async send(data: EmailProviderPayload): Promise<void> {
    const url = this.apiUrl + '/mail/send';
    const payload = this.buildPayload(data);

    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }
}
