import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationsService } from './registrations.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ConflictException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { allEvents, participantLimits } from './constants';

// Mock PrismaService
const mockPrismaService = {
  registration: {
    create: jest.fn(),
  },
};

// Mock EmailService to satisfy dependency
const mockEmailService = {
  sendRegistrationConfirmation: jest.fn(),
};

// --- Helper function to generate valid mock DTOs ---
let dtoCounter = 0;
const createMockRegistrationDto = (
  overrides: Partial<CreateRegistrationDto> = {},
): CreateRegistrationDto => {
  dtoCounter++;
  const defaults: CreateRegistrationDto = {
    name: `Test User ${dtoCounter}`,
    phone: '1234567890',
    email: `test${dtoCounter}@example.com`,
    college: 'Test College',
    eventType: 'Technical',
    event: 'Coding Contest',
    branch: 'CSE',
    duNumber: `DUA${1234567 + dtoCounter}`,
    participants: 0,
    participantDetails: [],
  };

  const dto = { ...defaults, ...overrides };

  // Auto-generate participantDetails if 'participants' is overridden and 'participantDetails' isn't.
  if (overrides.participants && !overrides.participantDetails) {
    dto.participantDetails = Array.from(
      { length: overrides.participants },
      (_, i) => ({ name: `Member ${i + 1}` }),
    );
  }

  return dto;
};

describe('RegistrationsService', () => {
  let service: RegistrationsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<RegistrationsService>(RegistrationsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRegistration', () => {
    // --- Error Handling Tests ---
    it('should throw a ConflictException if the email or duNumber is already registered', async () => {
      const dto = createMockRegistrationDto();
      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: 'x.x.x', meta: { target: ['email'] } },
      );
      prisma.registration.create.mockRejectedValue(prismaError);

      await expect(service.createRegistration(dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should rethrow an error if database creation fails for a non-conflict reason', async () => {
      const dto = createMockRegistrationDto();
      const genericError = new Error('Database connection lost');
      prisma.registration.create.mockRejectedValue(genericError);

      await expect(service.createRegistration(dto)).rejects.toThrow(
        genericError,
      );
    });

    // --- Dynamic Success Tests for All Events and All Participant Counts ---
    describe('for all events and valid participant counts', () => {
      allEvents.forEach((eventName) => {
        describe(`for event: ${eventName}`, () => {
          const maxParticipants = participantLimits[eventName];

          // Iterate from 0 up to the maximum number of allowed participants
          for (let i = 0; i <= maxParticipants; i++) {
            it(`should allow registration with ${i} additional participant(s)`, async () => {
              // Arrange
              const dto = createMockRegistrationDto({
                event: eventName,
                participants: i,
              });
              prisma.registration.create.mockResolvedValue({
                id: 1,
                ...dto,
                createdAt: new Date(),
                pushedToSheets: false,
              });

              // Act
              await service.createRegistration(dto);

              // Assert
              expect(prisma.registration.create).toHaveBeenCalledWith({
                data: dto,
              });
            });
          }
        });
      });
    });
  });
});
