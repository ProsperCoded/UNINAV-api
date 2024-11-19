import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentSchema } from './schemas/students.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { STUDENT_MODEL_NAME } from 'src/config/config';

@Module({
  // register student schema as an import
  imports: [
    MongooseModule.forFeature([
      { name: STUDENT_MODEL_NAME, schema: StudentSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [
    MongooseModule.forFeature([
      { name: STUDENT_MODEL_NAME, schema: StudentSchema },
    ]),
    StudentsService,
  ],
})
export class StudentsModule {}
