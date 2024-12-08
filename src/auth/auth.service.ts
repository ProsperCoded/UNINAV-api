import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { StudentsService } from 'src/students/students.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/LoginDto';
import { JwtService } from '@nestjs/jwt';
import { Student } from 'src/students/schemas/students.schema';
import { AuthPayload } from 'src/types/jwt';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import mainConfig from 'src/config/main.config';
import { ConfigType } from '@nestjs/config';
import { SignupDto } from './dto/Signup.dto';
import { UniversityEntitiesService } from 'src/university-entities/university-entities.service';
import { STUDENT_MODEL_NAME } from 'src/config/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private studentsService: StudentsService,
    // would have used this if we needed a single access token
    // private jwtService: JwtService,
    @Inject(mainConfig.KEY)
    private mainConfigService: ConfigType<typeof mainConfig>,
    @Inject('JWT_ACCESS_TOKEN_SERVICE') private jwtService: JwtService,
    @Inject('JWT_REFRESH_TOKEN_SERVICE')
    private jwtRefreshService: JwtService,
    private universityEntitiesService: UniversityEntitiesService,
    @InjectModel(STUDENT_MODEL_NAME) private studentModel: Model<Student>,
  ) {}
  async validateUser({ email, password }: LoginDto): Promise<any> {
    const student = await this.studentsService.findByEmail(email);
    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // ? simply use bcrypt.compare because salt is embedded in the hashed password
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (student.email == student.email.toLowerCase() && isValidPassword) {
      const { password, ...result } = student.toJSON();
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  async login(user: Student) {
    console.log('user to signIn', user);
    const userId = user._id.toString();
    const [access_token, refresh_token] = await this.generateToken(userId);

    await this.studentsService.updateRefreshToken(userId, refresh_token);
    return { access_token, refresh_token };
  }
  async signup(signupDto: SignupDto) {
    let savedStudent;

    const existingStudent = await this.studentsService.findByEmail(
      signupDto.email,
    );
    if (existingStudent) {
      throw new ForbiddenException({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      +this.mainConfigService.SALT,
    );
    try {
      // verify faculty, courses, departments exists
      if (signupDto.faculty) {
        const faculty = await this.universityEntitiesService.findFaculty(
          signupDto.faculty,
        );
        if (signupDto.department) {
          const department = faculty.departments.find((d) => {
            return d._id.toString() === signupDto.department;
          });
          if (!department) {
            throw new NotFoundException({ message: "Department wasn't found" });
          }
        }
        // verify courses here
      }
      const newStudent = new this.studentModel({
        ...signupDto,
        password: hashedPassword,
      });
      console.log('creating new account', signupDto);
      savedStudent = await newStudent.save();
      console.log('User Saved Successfully');
    } catch (error) {
      console.error('an error occurred in creating account', error);
      return {
        error: error.message,
        message: 'An error occurred in creating account',
      };
    }
    return { message: 'Account created successfully' };
  }
  async signOut(user: Student) {
    const userId = user._id.toString();
    await this.studentsService.updateRefreshToken(userId, '');
    return { message: 'Sign out successful' };
  }

  async refreshToken(user: Student) {
    const userId = user._id.toString();
    // const userId = user.id;
    const payload: AuthPayload = { id: userId };
    const refresh_token = this.jwtService.sign(payload);
    await this.studentsService.updateRefreshToken(userId, refresh_token);
    return {
      refresh_token,
    };
  }
  // generate access-token and refresh-token
  async generateToken(id: string) {
    const payload = { id };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtRefreshService.sign(payload),
    ]);
    return [access_token, refresh_token];
  }
  async validateRefreshToken(userId: string, refreshToken: string) {
    console.log('here in validateRefreshToken');
    const student = await this.studentsService.findOne(userId);
    if (student.refreshToken.toString() !== refreshToken) {
      throw new ForbiddenException('Invalid Refresh Token');
    }
    return student;
  }
  async validateGoogleOAuthLogin(googleUser: SignupDto) {
    const student = await this.studentsService.findByEmail(googleUser.email);
    if (student) {
      console.log(student.firstName, 'already exists');
      return student;
    }
    return await this.signup(googleUser);
  }
}
