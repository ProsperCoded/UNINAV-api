import { Optional } from '@nestjs/common';
import { IsMongoId, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFacultyDto {
  @IsString()
  facultyName: string;
}
export class CreateDepartmentDto {
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  departmentName: string;

  @IsMongoId()
  facultyId: string;

  @IsString({ each: true })
  @Optional()
  courses: string[] = [];
}
export class CreateCourseDto {
  @IsString()
  @Length(10, 50)
  courseName: string;

  @IsString()
  @Length(6, 6)
  courseCode: string;

  @IsString()
  @Length(10, 500)
  description: string;
}
