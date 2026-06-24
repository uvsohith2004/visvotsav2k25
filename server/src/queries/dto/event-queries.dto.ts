import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class EventQueriesDto {
  @ApiProperty({
    description: 'Email of the person making the query',
    example: 'yasovardhan',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Name of the person making the query',
    example: 'Yasovardhan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Message of the query',
    example: 'I have a question about the event.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
