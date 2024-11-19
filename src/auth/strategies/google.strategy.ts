import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import googleOauthConfig from 'src/config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { google } from 'googleapis';

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
      // scope: ['email', 'profile', 'https://www.googleapis.com/auth/drive'],
      scope: ['email', 'profile'],
      accessType: 'offline',
      prompt: 'consent',
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
      googleRefreshToken: refreshToken,
      googleAccessToken: accessToken,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avaterUrl: photos[0].value,
      password: '',
      // googleDriveAccessToken: accessToken, // Add this line to store the access token for Google Drive
    };
    console.log({ refreshToken, accessToken });
    console.log({ name, emails, photos });
    // done(null, user);
    // or just return the user

    // give me simple code to read the user's google drive files
    // access shared folder in google drive
    return this.authService.validateGoogleOAuthLogin(user);
  }

  // * Add this method to read the (test) user's google drive files
  // private async listGoogleDriveFiles(accessToken: string) {
  //   const oauth2Client = new google.auth.OAuth2();
  //   oauth2Client.setCredentials({ access_token: accessToken });

  //   const drive = google.drive({ version: 'v3', auth: oauth2Client });
  //   const res = await drive.files.list({
  //     pageSize: 10,
  //     fields: 'files(id, name)',
  //   });
  //   console.log('Files:', res.data.files);
  // }
}
