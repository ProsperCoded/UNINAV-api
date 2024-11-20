import {
  ForbiddenException,
  Inject,
  Injectable,
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
  async validateGoogleOAuthLogin(googleUser: CreateStudentDto) {
    const student = await this.studentsService.findByEmail(googleUser.email);
    if (student) {
      console.log(student.firstName, 'already exists');
      return student;
    }
    return await this.studentsService.create(googleUser);
  }
}
