import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { MaterialsModule } from './materials/materials.module';

@Module({
  imports: [StudentsModule, MaterialsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
