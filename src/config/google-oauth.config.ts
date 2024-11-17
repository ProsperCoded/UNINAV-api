import { registerAs } from '@nestjs/config';

export default registerAs('google-oath', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl: process.env.GOOGLE_REDIRECT_URL,
  apiKey: process.env.GOOGLE_API_KEY,
}));
