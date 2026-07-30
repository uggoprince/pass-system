import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePassDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  host?: string;

  // ISO date string, e.g. "2099-12-31"
  @IsDateString()
  validDate!: string;
}
