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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/gaurds/jwt/jwt.guard';
import { DeleteStudentDto } from './dto/delete-student.dto';
import { Req } from '@nestjs/common';
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  // * return regular information about specific user
  @Get(':id')
  findOne(@Param('id') id: string) {
    // verify that this is a valid objectid
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException('Invalid Student ID', 400);
    }
    return this.studentsService.findOne(id, true);
  }

  // todo return additional personal information about the user
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { id: string } }) {
    console.log('user id', req.user.id);
    return this.studentsService.findOne(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    // verify that this is a valid objectid
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException('Invalid Student ID2', 400);
    }
    return this.studentsService.update(id, updateStudentDto);
  }
  // delete a student account
  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Body() deleteStudentDto: DeleteStudentDto) {
    console.log('deleteStudentDto', deleteStudentDto);
    return this.studentsService.remove({
      id: req.user.id,
      ...deleteStudentDto,
    });
  }
}
