import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import {
  Material,
  MATERIAL_MODEL_NAME,
  MaterialSchema,
} from './schemas/material.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MATERIAL_MODEL_NAME, schema: MaterialSchema },
    ]),
    StudentsModule,
  ],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}
