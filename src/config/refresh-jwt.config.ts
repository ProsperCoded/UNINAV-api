import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'refresh-jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_REFRESH_SECRET_KEY,
    signOptions: { expiresIn: '2w' },
  }),
);
