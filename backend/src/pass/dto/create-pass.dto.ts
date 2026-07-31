import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePassDto {
  @ApiProperty({ example: 'Ada Lovelace', description: 'Name of the visitor the pass is issued to' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Reception', description: 'Name of the host receiving the visitor' })
  @IsString()
  @IsOptional()
  host?: string;

  @ApiProperty({ example: '2099-12-31', description: 'ISO date string the pass is valid through' })
  @IsDateString()
  validDate!: string;
}
