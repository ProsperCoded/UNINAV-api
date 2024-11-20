import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/gaurds/jwt/jwt.guard';
import { DeleteStudentDto } from './dto/delete-student.dto';
import { Req } from '@nestjs/common';
import { RequestFromAuth } from 'src/materials/types';
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
  getProfile(@Request() req: RequestFromAuth) {
    console.log('user id', req.user.id);
    return this.studentsService.findOne(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch()
  update(
    @Request() req: RequestFromAuth,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const { id } = req.user;
    // verify that this is a valid objectid
    // if (req.user.id !== id) {
    //   throw new UnauthorizedException(
    //     'Unauthorized to edit this student account',
    //   );
    // }
    // if (!mongoose.isValidObjectId(id)) {
    //   throw new BadRequestException('Invalid Student ID');
    // }
    return this.studentsService.update(id, updateStudentDto);
  }
  // delete a student account
  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() req: RequestFromAuth,
    @Body() deleteStudentDto: DeleteStudentDto,
  ) {
    console.log('deleteStudentDto', deleteStudentDto);
    return this.studentsService.remove({
      id: req.user.id,
      ...deleteStudentDto,
    });
  }
}
