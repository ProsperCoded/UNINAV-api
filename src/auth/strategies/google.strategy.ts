import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import googleOauthConfig from 'src/config/google-oauth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleOauthConfigurations: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleOauthConfigurations.clientId,
      clientSecret: googleOauthConfigurations.clientSecret,
      callbackURL: googleOauthConfigurations.redirectUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    const user: CreateStudentDto = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avaterUrl: photos[0].value,
      password: '',
    };
    // done(null, user);
    // or just return the user
    return this.authService.validateGoogleOAuthLogin(user);
  }
}
