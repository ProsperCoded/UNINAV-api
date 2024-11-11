import { PassportStrategy } from '@nestjs/passport';

import { Strategy, ExtractJwt } from 'passport-jwt';

import { JWT_REFRESH_SECRET_KEY } from 'src/config/config';
import { AuthPayload } from 'src/types/jwt';
const jwtHeader = 'refresh-token';
export class JwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor() {
    // validation, decoding and verification of the token is done here
    super({
      jwtFromRequest: ExtractJwt.fromHeader(jwtHeader),
      ignoreExpiration: false,
      secretOrKey: JWT_REFRESH_SECRET_KEY,
    });
  }
  // * here is just to receive the payload. and perform additional verification for identified token
  async validate(payload: AuthPayload) {
    console.log('payload after decoding refresh-token', payload);
    return payload;
  }
}
