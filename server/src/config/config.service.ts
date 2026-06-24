import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private nestConfigService: NestConfigService) {}
  getCronSecret(): string {
    const cronSecret = this.nestConfigService.get<string>('CRON_SECRET');
    if (!cronSecret) {
      throw new Error('CRON_SECRET environment variable is not set!');
    }
    return cronSecret;
  }
  getRecipients(): string {
    const recipients = this.nestConfigService.get<string>('RECIPIENTS');
    if (!recipients) {
      throw new Error('RECIPIENTS environment variable is not set!');
    }
    return recipients;
  }
  getSpreadsheetId(): string {
    return (
      this.nestConfigService.get<string>('SPREADSHEET_ID') ||
      this.getGraduationSpreadsheetId()
    );
  }

  getGraduationSpreadsheetId(): string {
    return (
      this.nestConfigService.get<string>('GRADUATION_SPREADSHEET_ID') ||
      '1nSK3VmRhyEPPg-6gsBVQez-N0NVU6s0mRdFgpCW2i-k'
    );
  }

  getGraduationSheetName(): string | undefined {
    return this.nestConfigService.get<string>('GRADUATION_SHEET_NAME');
  }

  getGoogleCredentials(): Record<string, any> {
    const base64String =
      this.nestConfigService.get<string>('GOOGLE_CRED_BASE64');

    if (!base64String) {
      throw new Error('GOOGLE_CRED_BASE64 environment variable is not set!');
    }

    try {
      const decodedBuffer = Buffer.from(base64String, 'base64');
      const jsonString = decodedBuffer.toString('utf-8');
      return JSON.parse(jsonString);
    } catch {
      throw new Error('Failed to decode or parse GOOGLE_CRED_BASE64.');
    }
  }

  getEmail(): string {
    const email = this.nestConfigService.get<string>('GMAIL_USER');
    if (!email) {
      throw new Error('EMAIL environment variable is not set!');
    }
    return email;
  }
  getEmailPassword(): string {
    const password = this.nestConfigService.get<string>('GMAIL_APP_PASSWORD');
    if (!password) {
      throw new Error('EMAIL_PASSWORD environment variable is not set!');
    }
    return password;
  }
}
