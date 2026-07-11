import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';

import { BookingsService } from './bookings.service';

import { CreateBookingDto } from './dto/create-booking.dto';

import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Public API

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  // Admin API with pagination ,filter, search

  @Get()
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'CONFIRMED',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'Dhanesh',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll(
    @Query()
    query: GetBookingsQueryDto,
  ) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto);
  }

  // Public cancellation

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.bookingsService.cancel(id);
  }
}
