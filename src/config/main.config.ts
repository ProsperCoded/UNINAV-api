import { registerAs } from '@nestjs/config';

export default registerAs('default', () => ({
  SALT: process.env.SALT,
}));
