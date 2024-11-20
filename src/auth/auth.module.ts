import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentsModule } from 'src/students/students.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import jwtConfig from 'src/config/jwt.config';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
@Module({
  imports: [
    StudentsModule,

    //* configuring jwt options
    JwtModule.registerAsync(jwtConfig.asProvider()),
    JwtModule.registerAsync(refreshJwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleStrategy,
    // because of the two access tokens (jwt and refresh token)
    // we'll need to provide the jwt strategy twice

    {
      provide: 'JWT_ACCESS_TOKEN_SERVICE',
      useExisting: JwtService,
    },
    {
      provide: 'JWT_REFRESH_TOKEN_SERVICE',
      useFactory: () => new JwtService(refreshJwtConfig()),
    },
  ],
  // exports: [JwtStrategy],
})
export class AuthModule {}
