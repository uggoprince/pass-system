import { ApiProperty } from '@nestjs/swagger';
import { PassStatus } from '../pass.entity';

export class CreatePassResponseDto {
  @ApiProperty({ example: 'c3b1f2a0-1234-4abc-9def-56789abcdef0' })
  id!: string;

  @ApiProperty({ example: 'V1StGXR8_Z' })
  code!: string;

  @ApiProperty({ enum: PassStatus, example: PassStatus.PENDING })
  status!: PassStatus;
}

export class PassDto {
  @ApiProperty({ example: 'c3b1f2a0-1234-4abc-9def-56789abcdef0' })
  id!: string;

  @ApiProperty({ example: 'V1StGXR8_Z' })
  code!: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  name!: string;

  @ApiProperty({ example: 'Reception', nullable: true })
  host!: string | null;

  @ApiProperty({ example: '2099-12-31' })
  validDate!: string;

  @ApiProperty({ enum: PassStatus, example: PassStatus.USED })
  status!: PassStatus;

  @ApiProperty({ example: '2026-07-31T12:00:00.000Z', nullable: true })
  usedAt!: Date | null;

  @ApiProperty({ example: '2026-07-30T09:00:00.000Z' })
  createdAt!: Date;
}

export class VerifyPassResponseDto {
  @ApiProperty({ enum: PassStatus, example: PassStatus.USED })
  status!: PassStatus;

  @ApiProperty({ type: PassDto })
  pass!: PassDto;
}
