import { Body, Controller, Post } from '@nestjs/common';
import { PassesService } from './passes.service';
import { CreatePassDto } from './dto/create-pass.dto';
import { VerifyPassDto } from './dto/verify-pass.dto';

@Controller('passes')
export class PassesController {
  constructor(private readonly service: PassesService) {}

  @Post()
  create(@Body() dto: CreatePassDto) {
    return this.service.create(dto);
  }

  @Post('verify')
  verify(@Body() dto: VerifyPassDto) {
    return this.service.verify(dto.code);
  }
}
