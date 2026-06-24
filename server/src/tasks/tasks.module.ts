import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';

import { GoogleSheetModule } from '../google-sheet/google-sheet.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
@Module({
  imports: [GoogleSheetModule, PrismaModule],
  providers: [TasksService],
  exports: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
