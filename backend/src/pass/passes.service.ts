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
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class PassesService {
  constructor(
    @InjectRepository(Pass) private readonly repo: Repository<Pass>,
    private readonly notifications: NotificationsService,
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
    const [rows] = await this.repo.query<[Pass[], number]>(
      `UPDATE passes
         SET status = 'USED', used_at = now()
       WHERE code = $1
         AND status = 'PENDING'
         AND valid_date >= CURRENT_DATE
       RETURNING *`,
      [code],
    );

    if (rows.length > 0) {
      // Fire the notification only on a genuine successful redemption.
      this.notifications.dispatch('pass.verified', 'push');
      return { status: 'USED', pass: rows[0] };
    }

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
