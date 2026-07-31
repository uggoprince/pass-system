import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPassDto {
  @ApiProperty({ example: 'V1StGXR8_Z', description: 'Unique code printed/embedded on the pass' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}
