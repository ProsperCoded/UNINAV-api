import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
// makes all the properties in CreateStudentDto optional
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
