import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { MaterialsModule } from './materials/materials.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import database from './config/database.config';
import jwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';
import googleOauthConfig from './config/google-oauth.config';
import config from './config/main.config';

const Database = 'uninav';
const mongoDBUrl = `mongodb+srv://prospercoded:1a2b3c...@restapi.bmamfwo.mongodb.net/${Database}?retryWrites=true&w=majority&appName=RestAPI`;

@Module({
  imports: [
    StudentsModule,
    MaterialsModule,
    MongooseModule.forRootAsync(database.asProvider()),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [database, config, jwtConfig, refreshJwtConfig, googleOauthConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
