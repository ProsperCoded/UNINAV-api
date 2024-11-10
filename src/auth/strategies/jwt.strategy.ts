import { PassportStrategy } from '@nestjs/passport';

import { Strategy, ExtractJwt } from 'passport-jwt';

import { SECRET_KEY } from 'src/config/config';
import { AuthPayload } from 'src/types/jwt';
const jwtHeader = 'access-token';
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // validation, decoding and verification of the token is done here
    super({
      jwtFromRequest: ExtractJwt.fromHeader(jwtHeader),
      ignoreExpiration: false,
      secretOrKey: SECRET_KEY,
    });
  }
  // * here is just to receive the payload. and perform additional verification for identified token
  async validate(payload: AuthPayload) {
    console.log('payload after decoding', payload);
    return payload;
  }
}
