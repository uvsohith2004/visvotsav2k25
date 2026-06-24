import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({
        CRON_SECRET: Joi.string().required(),
        GMAIL_USER: Joi.string().required(),
        GMAIL_APP_PASSWORD: Joi.string().required(),
        SPREADSHEET_ID: Joi.string().required(),
        GOOGLE_CRED_BASE64: Joi.string().required(),
        RECIPIENTS: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
