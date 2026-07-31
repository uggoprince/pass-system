import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Passes (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a pass, verifies it, then blocks the second verify', async () => {
    const create = await request(app.getHttpServer())
      .post('/passes')
      .send({ name: 'Ada', host: 'Reception', validDate: '2099-12-31' })
      .expect(201);

    const { code } = create.body as { code: string };
    expect(code).toBeDefined();

    // first verify succeeds
    await request(app.getHttpServer())
      .post('/passes/verify')
      .send({ code })
      .expect(201);

    // second verify is rejected — double-use blocked
    await request(app.getHttpServer())
      .post('/passes/verify')
      .send({ code })
      .expect(409);
  });

  it('rejects an unknown code with 404', async () => {
    await request(app.getHttpServer())
      .post('/passes/verify')
      .send({ code: 'does-not-exist' })
      .expect(404);
  });
});
