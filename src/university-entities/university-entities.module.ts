import { Module } from '@nestjs/common';
import { UniversityEntitiesService } from './university-entities.service';
import { UniversityEntitiesController } from './university-entities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultySchema } from './schema/faculty.schema';
import { Course, CourseSchema } from './schema/course.schema';
import { COURSE_MODEL_NAME, FACULTY_MODEL_NAME } from 'src/config/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FACULTY_MODEL_NAME, schema: FacultySchema },
      { name: COURSE_MODEL_NAME, schema: CourseSchema },
    ]),
  ],
  controllers: [UniversityEntitiesController],
  providers: [UniversityEntitiesService],
})
export class UniversityEntitiesModule {}
