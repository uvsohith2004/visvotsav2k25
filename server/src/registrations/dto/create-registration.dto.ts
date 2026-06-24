import {
  IsString,
  IsEmail,
  Matches,
  IsInt,
  IsArray,
  ValidateNested,
  IsIn,
  Validate,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { allEvents } from '../constants';
import { IsParticipantCountValidForEventConstraint } from '../validators/participant-limit.validator';
import { ArrayLengthMatchesPropertyConstraint } from '../validators/array-length-matches.validator';
import { ApiProperty } from '@nestjs/swagger';

function generateRandomDUNumber(): string {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
  const remainingDigits = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `DU${letter}${firstDigit}${remainingDigits}`;
}

class ParticipantDetailDto {
  @IsString()
  @MinLength(2)
  name: string;
}

export class CreateRegistrationDto {
  @ApiProperty({
    description: 'Name of the participant',
    example: 'Yasovardhan',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Phone number of the participant',
    example: '9876543210',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits.' })
  phone: string;
  @ApiProperty({
    description: 'Email of the participant',
    example: 'yasovardhnmasani@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'College of the participant',
    example: 'Delhi University',
  })
  @IsString()
  @IsNotEmpty()
  college: string;

  @ApiProperty({
    description: 'Type of event',
    example: 'Technical',
    enum: ['Technical', 'Cultural'],
  })
  @IsString()
  @IsIn(['Technical', 'Cultural'])
  eventType: string;

  @ApiProperty({
    description: 'Event name',
    example: 'Paper Presentation',
    enum: allEvents,
  })
  @IsString()
  @IsIn(allEvents)
  event: string;

  @ApiProperty({
    description: 'Branch of the participant',
    example: 'Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  branch: string;

  @ApiProperty({
    description: 'Year of study',
    example: generateRandomDUNumber(),
  })
  @Matches(/^DU[A-Z][0-9]{7}$/, { message: 'Invalid DU Number format.' })
  duNumber: string;

  @ApiProperty({
    description:
      'Number of additional participants (excluding the main registrant)',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Validate(IsParticipantCountValidForEventConstraint)
  participants: number;

  @ApiProperty({
    description: 'Details of additional participants',
    type: [ParticipantDetailDto],
    example: [{ name: 'Participant 1' }],
  })
  @IsArray()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDetailDto)
  @Validate(ArrayLengthMatchesPropertyConstraint, ['participants'])
  participantDetails: ParticipantDetailDto[];
}
