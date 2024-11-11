import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Student } from 'src/students/schemas/students.schema';
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
  signIn(@Request() req: { user: Student }) {
    // todo: perform other operations after login
    console.log('user on login', req.user);
    const signInInfo = this.authService.signIn(req.user);
    // const refresh_token = this.
    return signInInfo;
  }

  @Get('refresh')
  // @UseGuards(AuthGuard('local'))
  @UseGuards(JwtRefreshAuthGuard)
  refreshToken(@Request() req: { user: Student }) {
    // this will contain the access-token
    console.log('user on refresh', req.user);
    const newSignInInfo = this.authService.refreshToken(req.user);
    return newSignInInfo;
  }

  @Post('logout') // This is the correct HTTP method
  @UseGuards(JwtRefreshAuthGuard)
  signOut(@Request() req: { user: Student }) {
    // this will contain the refresh-token
    console.log('user on logout', req.user);
    const signOutInfo = this.authService.signOut(req.user);
    return signOutInfo;
  }
}
