import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BookingEntity } from './entities/booking.entity';

import { CreateBookingDto } from './dto/create-booking.dto';

import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

import { BookingStatus } from './enums/booking-status.enum';

import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,

    private servicesService: ServicesService,
  ) {}

  async create(dto: CreateBookingDto) {
    // 1. Check Service Exists

    const service = await this.servicesService.findOne(dto.serviceId);

    // 2. Validate Booking Date

    const bookingDate = dto.bookingDate;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    // 3. Prevent Duplicate Booking

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        bookingDate: dto.bookingDate,

        bookingTime: dto.bookingTime,

        service: {
          id: dto.serviceId,
        },
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'This service is already booked for the selected date and time',
      );
    }

    // 4. Create Booking

    const booking = this.bookingRepository.create({
      customerName: dto.customerName,

      customerEmail: dto.customerEmail,

      customerPhone: dto.customerPhone,

      bookingDate: dto.bookingDate,

      bookingTime: dto.bookingTime,

      notes: dto.notes,

      service,

      status: BookingStatus.PENDING,
    });

    return await this.bookingRepository.save(booking);
  }

  async findAll() {
    return await this.bookingRepository.find();
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(id: number, dto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id);

    // Business Rule

    if (
      booking.status === BookingStatus.CANCELLED &&
      dto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException('Cancelled bookings cannot be completed');
    }

    booking.status = dto.status;

    return await this.bookingRepository.save(booking);
  }

  async cancel(id: number) {
    const booking = await this.findOne(id);

    booking.status = BookingStatus.CANCELLED;

    return await this.bookingRepository.save(booking);
  }
}
