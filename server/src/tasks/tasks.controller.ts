import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ConfigService } from '../config/config.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly configService: ConfigService,
  ) {}

  @Get('sync-sheets')
  async triggerSync(@Headers('authorization') authHeader: string) {
    const cronSecret = this.configService.getCronSecret();
    if (!cronSecret || `Bearer ${cronSecret}` !== authHeader) {
      throw new UnauthorizedException(
        'Invalid or missing authorization token.',
      );
    }

    try {
      const result = await this.tasksService.syncRegistrationsToSheet();
      return {
        success: true,
        message: 'Cron job executed successfully.',
        details: result,
      };
    } catch (error) {
      console.error('Cron job execution failed:', error);
      throw new InternalServerErrorException(
        'The sync task failed to execute.',
      );
    }
  }
}
