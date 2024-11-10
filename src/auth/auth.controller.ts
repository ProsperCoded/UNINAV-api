import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { AuthGuard } from '@nestjs/passport';
import { Student } from 'src/students/schemas/students.schema';
import { JwtAuthGuard } from './gaurds/jwt/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @Post()
  // login(@Body() loginDto: LoginDto) {
  //   return this.authService.validateUser(loginDto);
  // }
  @Post('login')
  //  * defining a local strategy, using passport
  //  * this authentication will be done before calling loginLocal() method like a middleware
  @UseGuards(AuthGuard('local'))
  loginLocal(@Request() req: { user: Student }) {
    // todo: perform other operations after login
    console.log('user on login', req.user);
    const signInInfo = this.authService.signIn(req.user);
    return signInInfo;
  }
}
