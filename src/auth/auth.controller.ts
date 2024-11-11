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
import { JwtAuthGuard } from './gaurds/jwt/jwt.guard';
import { JwtRefreshAuthGuard } from './gaurds/refresh-jwt/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  //  * defining a local strategy, using passport
  //  * this authentication will be done before calling loginLocal() method like a middleware
  //  * perform a email & password validation
  @UseGuards(AuthGuard('local'))

  // * responsible for creating access-token for future logins
  loginLocal(@Request() req: { user: Student }) {
    // todo: perform other operations after login
    console.log('user on login', req.user);
    const signInInfo = this.authService.signIn(req.user);
    // const refresh_token = this.
    return signInInfo;
  }

  @Post('refresh')
  // @UseGuards(AuthGuard('local'))
  refreshToken(@Request() req: { user: Student }) {
    // this will contain the access-token
    const newSignInInfo = this.authService.refreshToken(req.user);

    return newSignInInfo;
  }
}
