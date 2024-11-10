import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentsModule } from 'src/students/students.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/config/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    StudentsModule,

    // for jwt strategy
    //* configuring jwt options
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  // exports: [AuthService],
})
export class AuthModule {}
