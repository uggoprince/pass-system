import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PassStatus {
  PENDING = 'PENDING',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

@Entity('passes')
export class Pass {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  host!: string | null;

  @Column({ name: 'valid_date', type: 'date' })
  validDate!: string;

  @Column({ type: 'enum', enum: PassStatus, default: PassStatus.PENDING })
  status!: PassStatus;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
