import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PassesService } from './passes.service';
import { CreatePassDto } from './dto/create-pass.dto';
import { VerifyPassDto } from './dto/verify-pass.dto';
import { CreatePassResponseDto, VerifyPassResponseDto } from './dto/pass-response.dto';

@ApiTags('passes')
@Controller('passes')
export class PassesController {
  constructor(private readonly service: PassesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a pass', description: 'Generates a unique code and stores it as PENDING.' })
  @ApiResponse({ status: 201, description: 'Pass created.', type: CreatePassResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  create(@Body() dto: CreatePassDto) {
    return this.service.create(dto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify (redeem) a pass', description: "Redeems a PENDING pass by code, marking it USED." })
  @ApiResponse({ status: 201, description: 'Pass successfully redeemed.', type: VerifyPassResponseDto })
  @ApiResponse({ status: 404, description: 'Unknown code.' })
  @ApiResponse({ status: 409, description: 'Pass already used.' })
  @ApiResponse({ status: 410, description: 'Pass expired.' })
  verify(@Body() dto: VerifyPassDto) {
    return this.service.verify(dto.code);
  }
}
