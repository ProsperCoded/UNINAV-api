import { IsString, IsEmail, Length, IsOptional } from 'class-validator';
export class CreateStudentDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  matricNumber: string;

  // secondary information the user can add later
  @IsString()
  @IsOptional()
  department: string;

  @IsString()
  @IsOptional()
  level: string;

  @IsString()
  @IsOptional()
  faculty: string;

  @IsString({ each: true })
  @IsOptional()
  courses: string[];
}
