import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPassDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}
