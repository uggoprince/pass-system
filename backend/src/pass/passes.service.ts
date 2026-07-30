import {
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { Pass, PassStatus } from './pass.entity';
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

  async verify(code: string) {
    const existing = await this.repo.findOne({ where: { code } });

    if (!existing) {
      throw new NotFoundException('Invalid code'); // 404
    }
    if (existing.status === PassStatus.USED) {
      throw new ConflictException('Pass already used'); // 409 — double-use blocked
    }

    // Still PENDING but out of date (or already EXPIRED): mark it EXPIRED.
    if (existing.status !== PassStatus.EXPIRED) {
      existing.status = PassStatus.EXPIRED;
      await this.repo.save(existing);
    }
    throw new GoneException('Pass expired');
  }
}
