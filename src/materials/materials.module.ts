import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Material, MaterialSchema } from './schemas/material.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Material', schema: MaterialSchema }]),
    StudentsModule,
  ],
  controllers: [MaterialsController],
  providers: [MaterialsService],
})
export class MaterialsModule {}
