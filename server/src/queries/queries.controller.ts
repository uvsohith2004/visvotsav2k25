import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventQueriesDto } from './dto/event-queries.dto';

@ApiTags('Queries')
@Controller('api/queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Post()
  @ApiBody({ type: EventQueriesDto })
  @ApiResponse({ status: 201, description: 'Query received successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @HttpCode(HttpStatus.CREATED)
  eventQuery(@Body() body: EventQueriesDto) {
    return this.queriesService.handleQuery(body);
  }
}
