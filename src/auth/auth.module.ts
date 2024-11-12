import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentsModule } from 'src/students/students.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from 'src/config/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { JwtAuthGuard } from './gaurds/jwt/jwt.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    StudentsModule,

    //* configuring jwt options
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    JwtModule.register({
      secret: JWT_REFRESH_SECRET_KEY,
      signOptions: { expiresIn: '2w' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,

    // because of the two access tokens (jwt and refresh token)
    // we'll need to provide the jwt strategy twice

    {
      provide: 'JWT_ACCESS_TOKEN_SERVICE',
      useExisting: JwtService,
    },
    {
      provide: 'JWT_REFRESH_TOKEN_SERVICE',
      useFactory: (jwtModule: JwtModule) =>
        new JwtService({
          secret: JWT_REFRESH_SECRET_KEY,
          signOptions: { expiresIn: '2w' },
        }),
    },

    // Enable authentication globally
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // * this can be done more than once if you have multiple guards
  ],
})
export class AuthModule {}
