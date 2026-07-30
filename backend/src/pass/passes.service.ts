import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { Pass } from './pass.entity';
import { CreatePassDto } from './dto/create-pass.dto';

@Injectable()
export class PassesService {
  constructor(
    @InjectRepository(Pass) private readonly repo: Repository<Pass>,
  ) {}

  async create(dto: CreatePassDto) {
    const code = nanoid(10);
    const pass = this.repo.create({
      code,
      name: dto.name,
      host: dto.host,
      validDate: dto.validDate,
    });
    await this.repo.save(pass);
    return { id: pass.id, code: pass.code, status: pass.status };
  }
}
