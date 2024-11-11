import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

import { Strategy, ExtractJwt } from 'passport-jwt';

import { JWT_REFRESH_SECRET_KEY } from 'src/config/config';
import { AuthPayload } from 'src/types/jwt';
import { AuthService } from '../auth.service';
const jwtHeader = 'refresh-token';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly authService: AuthService, // * inject the authService
  ) {
    // validation, decoding and verification of the token is done here
    super({
      jwtFromRequest: ExtractJwt.fromHeader(jwtHeader),
      ignoreExpiration: false,
      secretOrKey: JWT_REFRESH_SECRET_KEY,
      passReqToCallback: true,
    });
  }
  // * here is just to receive the payload. and perform additional verification for identified token
  async validate(request: Request, payload: AuthPayload) {
    // grab the token from the header
    let token = request.headers[jwtHeader];
    if (!token) {
      // token wasn't sent
      return null;
    }
    console.log(payload, token);
    token = token.toString().trim();
    const user = await this.authService.validateRefreshToken(payload.id, token);
    console.log('payload after decoding refresh-token', payload);
    return user;
  }
}
