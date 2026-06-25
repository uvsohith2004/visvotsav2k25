import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const branches = [
  'CSE',
  'ECE',
  'MECH',
  'CIVIL',
  'CSE-IOT',
  'CSE-AIML',
  'MBA',
  'EEE',
  'CSE-AI',
  'Others',
] as const;

export class CreateGraduationRegistrationDto {
  @ApiProperty({ example: 'Ravi Kumar' })
  @IsString()
  @MinLength(2)
  studentName: string;

  @ApiProperty({ example: '20A91A0401' })
  @IsString()
  @IsNotEmpty()
  hallTicketNumber: string;

  @ApiProperty({ example: 'ECE', enum: branches })
  @IsString()
  @IsIn(branches)
  branch: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be 10 digits.' })
  mobileNumber: string;

  @ApiProperty({ example: 'Yes', enum: ['Yes', 'No'] })
  @IsString()
  @IsIn(['Yes', 'No'])
  willAttend: string;

  @ApiProperty({ example: '3', enum: ['0', '1', '2', '3', '4'] })
  @IsString()
  @IsIn(['0', '1', '2', '3', '4'])
  numberOfGuests: string;

  @ApiProperty({ example: 'student@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '05-07-2026' })
  @IsOptional()
  @IsString()
  graduationDate: string;

  @ApiProperty({ example: '07:30 AM' })
  @IsString()
  @IsNotEmpty()
  reportingTime: string;

  @ApiProperty({ example: 'KVR Convention Hall' })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiProperty({ example: 'data:image/jpeg;base64,...' })
  @IsString()
  @IsNotEmpty()
  photo: string;
}
