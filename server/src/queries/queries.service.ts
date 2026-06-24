import { Injectable } from '@nestjs/common';
import { EventQueriesDto } from './dto/event-queries.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class QueriesService {
  constructor(private readonly emailService: EmailService) {}
  async handleQuery(queryDto: EventQueriesDto) {
    try {
      await this.emailService.sendQueryNotification(queryDto);
    } catch (err) {
      console.error('Error sending email:', err);
      throw err;
    }
  }
}
