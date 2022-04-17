import { Module } from '@nestjs/common';
import { EmailTemplateFormatter } from './helpers/email-template-formatter.service';
import { EmailService } from './email.service';
import { EmailRetriever } from './helpers/email.retriever.service';

@Module({
  providers: [EmailService, EmailTemplateFormatter, EmailRetriever],
  exports: [EmailService],
})
export class EmailModule {}
