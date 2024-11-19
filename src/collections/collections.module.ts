import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from './collections.schema';
import { MaterialsModule } from 'src/materials/materials.module';
import { StudentsModule } from 'src/students/students.module';
import { COLLECTION_MODEL_NAME } from 'src/config/config';

@Module({
  imports: [
    MaterialsModule,
    StudentsModule,
    MongooseModule.forFeature([
      {
        name: COLLECTION_MODEL_NAME,
        schema: CollectionSchema,
      },
    ]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
