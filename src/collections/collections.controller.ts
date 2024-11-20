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
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from 'src/gaurds/jwt/jwt.guard';
import { RequestFromAuth } from 'src/materials/types';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: RequestFromAuth,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    const owner = req.user.id;
    return this.collectionsService.create(owner, createCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Req() req: RequestFromAuth,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    const owner = req.user.id;
    return this.collectionsService.update(id, owner, updateCollectionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: RequestFromAuth) {
    const owner = req.user.id;
    return this.collectionsService.remove(id, owner);
  }
}
