import { ForbiddenException, Injectable } from '@nestjs/common';
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
    private jwtService: JwtService,
  ) {}
  async validateUser({ email, password }: LoginDto): Promise<any> {
    const student = await this.studentsService.findByEmail(email);
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (student.email == student.email.toLowerCase() && isValidPassword) {
      const { password, ...result } = student.toJSON();
      return result;
    }
    throw new ForbiddenException('Invalid credentials');
  }
  async signIn(user: Student) {
    console.log('user', user);
    const payload: AuthPayload = { id: user._id.toString() };
    console.log('payload before encoding', payload);
    const access_token = this.jwtService.sign(payload);
    console.log('token after encoding', access_token);
    return {
      access_token,
    };
  }
}
