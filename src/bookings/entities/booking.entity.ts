import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { ServiceEntity } from '../../services/entities/service.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

  @Column()
  customerEmail!: string;

  @Column()
  customerPhone!: string;

  @Column({
    type: 'date',
  })
  bookingDate!: Date;

  @Column({
    type: 'time',
  })
  bookingTime!: string;

  @Column({
    nullable: true,
  })
  notes?: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @ManyToOne(() => ServiceEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'serviceId',
  })
  service!: ServiceEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
