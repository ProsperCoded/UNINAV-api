import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentSchema } from './schemas/students.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  // register student schema as an import
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    StudentsService,
  ],
})
export class StudentsModule {}
