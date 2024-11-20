import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { Strategy, ExtractJwt } from 'passport-jwt';
import jwtConfig from 'src/config/jwt.config';

import { AuthPayload } from 'src/types/jwt';
const jwtHeader = 'access-token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    // validation, decoding and verification of the token is done here
    super({
      jwtFromRequest: ExtractJwt.fromHeader(jwtHeader),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret,
    });
  }
  // * here is just to receive the payload. and perform additional verification for identified token
  async validate(payload: AuthPayload) {
    console.log('payload after decoding', payload);
    return payload;
  }
}
