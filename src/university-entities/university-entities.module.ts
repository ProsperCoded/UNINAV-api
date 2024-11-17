import { Module } from '@nestjs/common';
import { UniversityEntitiesService } from './university-entities.service';
import { UniversityEntitiesController } from './university-entities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Faculty, FacultySchema } from './schema/faculty.schema';
import { Course, CourseSchema } from './schema/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faculty.name, schema: FacultySchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [UniversityEntitiesController],
  providers: [UniversityEntitiesService],
})
export class UniversityEntitiesModule {}
