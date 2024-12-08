import {
  IsString,
  IsEmail,
  Length,
  IsOptional,
  IsMongoId,
} from 'class-validator';
export class SignupDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  // ! Temporarily compulsory
  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  @Length(6, 6)
  @IsOptional()
  matricNumber?: string;

  // secondary information the user can add later
  @IsMongoId()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsMongoId()
  @IsOptional()
  faculty?: string;

  @IsMongoId({ each: true })
  @IsOptional()
  courses?: string[];

  avaterUrl?: string;
  googleRefreshToken?: string;
  googleAccessToken?: string;
}
