import { Module } from '@nestjs/common';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleSheetModule } from '../google-sheet/google-sheet.module';

@Module({
  imports: [PrismaModule, GoogleSheetModule],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
})
export class RegistrationsModule {}
