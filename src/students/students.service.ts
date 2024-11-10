import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { Student } from './schemas/students.schema';
import * as bcrypt from 'bcryptjs';
import { SALT } from 'src/config/config';
// import mongoose from 'mongoose';
@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    let savedStudent;
    try {
      const hashedPassword = await bcrypt.hash(createStudentDto.password, SALT);
      const newStudent = new this.studentModel({
        ...createStudentDto,
        password: hashedPassword,
      });
      console.log('creating new user', createStudentDto);
      savedStudent = await newStudent.save();
      console.log('User Saved Successfully');
    } catch (error) {
      console.error('an error occurred in creating and saving student', error);
      return error.message;
    }
    return savedStudent;
  }

  findAll() {
    return this.studentModel.find();
  }
  async findByEmail(email: string) {
    const student = await this.studentModel.findOne({ email });
    return student;
  }
  async findOne(id: string) {
    const student = await this.studentModel.findById(id);
    if (!student) throw new HttpException('Student not found', 404);
    return student.populate('materials');
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    let updatedStudent;
    try {
      updatedStudent = await this.studentModel.findByIdAndUpdate(
        id,
        updateStudentDto,
        { new: true },
      );
      if (!updatedStudent)
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      console.error('an error occurred in updating student', error);
      return error.message;
    }
    return updatedStudent;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
