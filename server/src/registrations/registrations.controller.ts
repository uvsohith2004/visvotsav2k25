import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateGraduationRegistrationDto } from './dto/create-graduation-registration.dto';

@ApiTags('Registrations')
@Controller('api/form-submit')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new event registration' })
  @ApiBody({
    description: 'The registration data for a new participant or team.',
    type: CreateRegistrationDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The registration was successful.',
    schema: {
      example: { success: true, message: 'Registration successful!' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The submitted data is invalid.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: The email or DU Number is already registered.',
  })
  async create(@Body() createRegistrationDto: CreateRegistrationDto) {
    await this.registrationsService.createRegistration(createRegistrationDto);
    return { success: true, message: 'Registration successful!' };
  }

  @Post('graduation')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new Graduation Day registration' })
  @ApiBody({
    description: 'Graduation Day student registration data.',
    type: CreateGraduationRegistrationDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The graduation registration was saved to Google Sheets.',
    schema: {
      example: {
        success: true,
        message: 'Graduation registration saved successfully!',
      },
    },
  })
  async createGraduation(
    @Body() createGraduationDto: CreateGraduationRegistrationDto,
  ) {
    await this.registrationsService.createGraduationRegistration(
      createGraduationDto,
    );
    return {
      success: true,
      message: 'Graduation registration saved successfully!',
    };
  }
}
