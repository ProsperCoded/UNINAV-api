import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Req,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Student } from 'src/students/schemas/students.schema';
import { JwtRefreshAuthGuard } from '../gaurds/refresh-jwt/refresh-jwt.guard';
import { GoogleAuthGuard } from '../gaurds/google-auth/google-auth.guard';
import { FRONTEND_URL } from 'src/config/config';
import { SignupDto } from './dto/Signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  //  * defining a local strategy, using passport
  //  * this authentication will be done before calling loginLocal() method like a middleware
  //  * perform a email & password validation
  @UseGuards(AuthGuard('local'))

  // * responsible for creating access-token for future logins
  login(@Request() req: { user: Student }) {
    // todo: perform other operations after login
    console.log('user on login', req.user);
    const signInInfo = this.authService.login(req.user);
    // const refresh_token = this.
    return signInInfo;
  }
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
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
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req) {
    console.log('google/login request.user =>', req.user);
    // initiates the google login process
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res) {
    // you should create your own refresh toke,
    // the one created by google isn't what is signIned in you application
    const signInInfo = await this.authService.login(req.user);

    // redirect user with new access token
    const url = new URL(FRONTEND_URL);
    url.searchParams.append('access_token', signInInfo.access_token);
    url.searchParams.append('refresh_token', signInInfo.refresh_token);
    console.log('redirected user to ', url.toString());
    res.redirect(url.toString());
  }
}
