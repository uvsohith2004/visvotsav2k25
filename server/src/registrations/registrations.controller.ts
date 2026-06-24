import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

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
}
