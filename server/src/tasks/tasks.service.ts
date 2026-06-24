import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleSheetService } from '../google-sheet/google-sheet.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private isJobRunning = false;
  private readonly maxAdditionalParticipants = 4;

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleSheets: GoogleSheetService,
  ) {}

  async syncRegistrationsToSheet(): Promise<string> {
    if (this.isJobRunning) {
      this.logger.warn('Skipping cron run, job already running.');
      return 'Job skipped: another sync is already in progress.';
    }
    this.isJobRunning = true;
    this.logger.log(
      'Running job: Syncing new registrations to Google Sheets...',
    );

    try {
      const newRegistrations = await this.prisma.registration.findMany({
        where: { pushedToSheets: false },
        take: 500,
      });

      if (newRegistrations.length === 0) {
        this.logger.log('No new registrations to sync.');
        return 'No new registrations to sync.';
      }

      const registrationsByEvent = newRegistrations.reduce(
        (acc, reg) => {
          if (!acc[reg.event]) {
            acc[reg.event] = [];
          }
          acc[reg.event].push(reg);
          return acc;
        },
        {} as Record<string, typeof newRegistrations>,
      );

      let successCount = 0;
      for (const eventName in registrationsByEvent) {
        const registrations = registrationsByEvent[eventName];
        const rowsToAppend = registrations.map((reg) => {
          const participantNames = (reg.participantDetails as any[]).map(
            (p) => p.name,
          );
          const paddedNames = [
            ...participantNames,
            ...Array(
              this.maxAdditionalParticipants - participantNames.length,
            ).fill(''),
          ];

          return [
            reg.name,
            reg.phone,
            reg.email,
            reg.college,
            reg.eventType,
            reg.event,
            reg.branch,
            reg.duNumber,
            reg.participants,
            ...paddedNames,
          ];
        });

        try {
          await this.googleSheets.appendRows(eventName, rowsToAppend);

          const successfulIds = registrations.map((r) => r.id);
          await this.prisma.registration.updateMany({
            where: { id: { in: successfulIds } },
            data: { pushedToSheets: true },
          });

          successCount += registrations.length;
          this.logger.log(
            `Successfully synced ${registrations.length} registrations for event: ${eventName}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to sync batch for event ${eventName}. Error: ${error.message}`,
          );
        }
      }

      const resultMessage = `Job finished. Synced ${successCount} of ${newRegistrations.length} registrations.`;
      this.logger.log(resultMessage);
      return resultMessage;
    } finally {
      this.isJobRunning = false;
    }
  }
}
