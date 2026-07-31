import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { PassesService } from '../src/pass/passes.service';
import { Pass, PassStatus } from '../src/pass/pass.entity';
import { NotificationsService } from '../src/notifications/notifications.service';

describe('PassesService', () => {
  let service: PassesService;
  let repo: MockRepo;
  let notifications: { dispatch: jest.Mock };

  beforeEach(async () => {
    repo = {
      create: jest.fn((x: Partial<Pass>) => x),
      save: jest.fn((x: Partial<Pass>) => Promise.resolve(x)),
      query: jest.fn(),
      findOne: jest.fn(),
    };
    notifications = { dispatch: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PassesService,
        { provide: getRepositoryToken(Pass), useValue: repo },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();

    service = moduleRef.get(PassesService);
  });

  it('creates a pass with a generated code', async () => {
    const res = await service.create({
      name: 'Ada',
      host: 'Reception',
      validDate: '2099-12-31',
    });
    expect(res.code).toBeDefined();
    expect(res.status).toBe(PassStatus.PENDING);
    expect(repo.save).toHaveBeenCalled();
  });

  it('verifies a PENDING pass once and marks it USED + notifies', async () => {
    repo.query.mockResolvedValueOnce([{ code: 'abc', status: 'USED' }]);
    const res = await service.verify('abc');
    expect(res.status).toBe('USED');
    expect(notifications.dispatch).toHaveBeenCalledWith(
      'pass.verified',
      'push',
    );
  });

  it('blocks a second verify of the same pass (double-use)', async () => {
    repo.query.mockResolvedValueOnce([]); // atomic update matched nothing
    repo.findOne.mockResolvedValueOnce({
      code: 'abc',
      status: PassStatus.USED,
    });
    await expect(service.verify('abc')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(notifications.dispatch).not.toHaveBeenCalled();
  });

  it('returns 404 for an unknown code', async () => {
    repo.query.mockResolvedValueOnce([]);
    repo.findOne.mockResolvedValueOnce(null);
    await expect(service.verify('nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('marks an out-of-date pass EXPIRED and rejects it', async () => {
    repo.query.mockResolvedValueOnce([]); // failed the valid_date guard
    repo.findOne.mockResolvedValueOnce({
      code: 'abc',
      status: PassStatus.PENDING,
    });
    await expect(service.verify('abc')).rejects.toBeInstanceOf(GoneException);
    expect(repo.save).toHaveBeenCalled(); // flipped to EXPIRED
  });
});
