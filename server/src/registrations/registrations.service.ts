import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GoogleSheetService } from '../google-sheet/google-sheet.service';
import { ConfigService } from '../config/config.service';
import { CreateGraduationRegistrationDto } from './dto/create-graduation-registration.dto';

const graduationDatesByBranch: Record<string, string> = {
  CSE: '04-07-2026',
  'CSE-IOT': '04-07-2026',
  MBA: '04-07-2026',
  ECE: '05-07-2026',
  CIVIL: '05-07-2026',
  'CSE-AIML': '05-07-2026',
  'CSE-AI': '05-07-2026',
  Others: '05-07-2026',
};

const getGraduationDate = (branch: string) =>
  graduationDatesByBranch[branch] || graduationDatesByBranch.Others;

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleSheets: GoogleSheetService,
    private readonly configService: ConfigService,
  ) {}

  async createRegistration(dto: CreateRegistrationDto) {
    try {
      const registration = await this.prisma.registration.create({
        data: {
          ...dto,
          participantDetails: dto.participantDetails
            ? dto.participantDetails.map((detail) => ({ ...detail }))
            : [],
        },
      });
      this.logger.log(
        `Successfully registered: ${dto.name} for event ${dto.event}`,
      );
      return registration;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const field = (error.meta as { target: string[] }).target[0];
        this.logger.warn(
          `Conflict error for ${field} on registration attempt.`,
        );
        throw new ConflictException(`${field} is already registered.`);
      }
      this.logger.error(
        'An unexpected error occurred during registration.',
        error.stack,
      );
      throw error;
    }
  }

  async createGraduationRegistration(dto: CreateGraduationRegistrationDto) {
    const defaultHeaders = [
      'Student Name',
      'Hall Ticket Number',
      'Branch',
      'Mobile Number',
      'Will Attend?',
      'Number of Guests',
      'Graduation Date',
      'Email ID',
      'Reporting Time',
      'Venue',
      'Submitted At',
    ];

    await this.googleSheets.appendObjectRow({
      spreadsheetId: this.configService.getGraduationSpreadsheetId(),
      sheetName: this.configService.getGraduationSheetName(),
      defaultHeaders,
      row: {
        studentName: dto.studentName,
        hallTicketNumber: dto.hallTicketNumber,
        branch: dto.branch,
        mobileNumber: dto.mobileNumber,
        willAttend: dto.willAttend,
        numberOfGuests: dto.numberOfGuests,
        graduationDate: getGraduationDate(dto.branch),
        email: dto.email,
        reportingTime: dto.reportingTime,
        venue: dto.venue,
        submittedAt: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      },
    });

    this.logger.log(
      `Graduation registration added to sheet: ${dto.studentName} (${dto.hallTicketNumber})`,
    );
  }
}
