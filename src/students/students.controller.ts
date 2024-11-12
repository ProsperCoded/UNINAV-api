import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt/jwt.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.studentsService.findAll();
  }
  // todo return additional personal information about the user
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { id: string } }) {
    console.log('user id', req.user.id);
    return this.studentsService.findOne(req.user.id);
  }
  // * return regular information about specific user
  @Get(':id')
  findOne(@Param('id') id: string) {
    // verify that this is a valid objectid
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException('Invalid Student ID', 400);
    }
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    // verify that this is a valid objectid
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException('Invalid Student ID', 400);
    }
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
