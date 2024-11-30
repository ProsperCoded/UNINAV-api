import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtAuthGuard } from 'src/gaurds/jwt/jwt.guard';
import { RequestFromAuth } from './types';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get('search')
  search(@Query('query') query: string) {
    return this.materialsService.search(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: RequestFromAuth,
    @Body() createMaterialDto: CreateMaterialDto,
  ) {
    const owner = req.user.id;
    return this.materialsService.create(owner, createMaterialDto);
  }

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Req() req: RequestFromAuth,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    const owner = req.user.id;
    return this.materialsService.update(id, owner, updateMaterialDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: RequestFromAuth) {
    const owner = req.user.id;
    return this.materialsService.remove(id, owner);
  }
}
