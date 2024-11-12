import { registerAs } from '@nestjs/config';
export default registerAs('default', () => {
  return {
    uri: process.env.MONGODB_URL,
  };
});
