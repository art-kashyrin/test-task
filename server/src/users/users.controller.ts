import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ErrorResponseDto } from '../common/dto/error-response.dto'
import { UsersService } from './users.service'
import { CityStatsQueryDto } from './dto/city-stats-query.dto'
import { CityStatsPageDto } from './dto/city-stats-page.dto'

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'offset', required: false, type: Number, minimum: 0, default: 0 })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @ApiOkResponse({ type: CityStatsPageDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  getCityStats(@Query() query: CityStatsQueryDto): Promise<CityStatsPageDto> {
    return this.usersService.getCityStats(query.limit, query.offset)
  }
}
