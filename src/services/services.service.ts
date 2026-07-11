import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ServiceEntity } from './entities/service.entity';

import { CreateServiceDto } from './dto/create-service.dto';

import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private serviceRepository: Repository<ServiceEntity>,
  ) {}

  async create(dto: CreateServiceDto) {
    const service = this.serviceRepository.create(dto);

    return await this.serviceRepository.save(service);
  }

  async findAll() {
    return await this.serviceRepository.find();
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOne({
      where: {
        id,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: number, dto: UpdateServiceDto) {
    const service = await this.findOne(id);

    Object.assign(service, dto);

    return await this.serviceRepository.save(service);
  }

  async remove(id: number) {
    const service = await this.findOne(id);

    await this.serviceRepository.remove(service);

    return {
      message: 'Service deleted successfully',
    };
  }
}
