import {
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class DeleteStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  deleteMaterials: boolean;

  id: string;
}
