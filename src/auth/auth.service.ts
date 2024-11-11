import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { StudentsService } from 'src/students/students.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/LoginDto';
import { JwtService } from '@nestjs/jwt';
import { Student } from 'src/students/schemas/students.schema';
import { AuthPayload } from 'src/types/jwt';

@Injectable()
export class AuthService {
  constructor(
    private studentsService: StudentsService,
    // would have used this if we needed a single access token
    // private jwtService: JwtService,
    @Inject('JWT_ACCESS_TOKEN_SERVICE') private jwtService: JwtService,
    @Inject('JWT_REFRESH_TOKEN_SERVICE')
    private jwtRefreshService: JwtService,
  ) {}
  async validateUser({ email, password }: LoginDto): Promise<any> {
    const student = await this.studentsService.findByEmail(email);
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (student.email == student.email.toLowerCase() && isValidPassword) {
      const { password, ...result } = student.toJSON();
      return result;
    }
  }
  async signIn(user: Student) {
    console.log('user', user);
    const payload: AuthPayload = { id: user._id.toString() };
    console.log('payload before encoding', payload);
    const access_token = this.jwtService.sign(payload);

    // -------------------------------------------------------
    console.log('token after encoding', access_token);
    const refresh_token = this.jwtRefreshService.sign(payload);

    return { access_token, refresh_token };
  }

  refreshToken(user: Student) {
    const payload: AuthPayload = { id: user._id.toString() };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }
}
