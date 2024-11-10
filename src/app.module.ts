import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { MaterialsModule } from './materials/materials.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { AuthModule } from './auth/auth.module';

const Database = 'uninav';
const mongoDBUrl = `mongodb+srv://prospercoded:1a2b3c...@restapi.bmamfwo.mongodb.net/${Database}?retryWrites=true&w=majority&appName=RestAPI`;
@Module({
  imports: [
    StudentsModule,
    MaterialsModule,
    MongooseModule.forRoot(mongoDBUrl),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
