import { IsEmail, IsInt, IsOptional, IsString, IsDate } from 'class-validator';

import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsString()
  customerPhone!: string;

  @IsInt()
  serviceId!: number;

  @Type(() => Date)
  @IsDate()
  bookingDate!: Date;

  @IsString()
  bookingTime!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
