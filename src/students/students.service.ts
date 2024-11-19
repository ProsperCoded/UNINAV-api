import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './schemas/students.schema';
import * as bcrypt from 'bcryptjs';
import { ConfigType } from '@nestjs/config';
import mainConfig from 'src/config/main.config';
import { DeleteStudentDto } from './dto/delete-student.dto';
import { STUDENT_MODEL_NAME } from 'src/config/config';
const fieldsAllowed = [
  'id',
  'firstName',
  'lastName',
  'email',
  'matricNumber',
  'department',
  'faculty',
  'courses',
  // 'refreshToken',
];
// import mongoose from 'mongoose';
@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(STUDENT_MODEL_NAME) private studentModel: Model<Student>,
    @Inject(mainConfig.KEY)
    private mainConfigService: ConfigType<typeof mainConfig>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    let savedStudent;
    try {
      const hashedPassword = await bcrypt.hash(
        createStudentDto.password,
        +this.mainConfigService.SALT,
      );
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
  async findOne(id: string, filter = false) {
    // ? filter result if it's to be returned directly to client
    const student = filter
      ? await this.studentModel.findOne({
          where: { id },
          select: fieldsAllowed,
        })
      : await this.studentModel.findById(id);

    if (!student) throw new HttpException('Student not found', 404);
    return student.populate('materials');
  }
  async updateRefreshToken(id: string, refreshToken: string) {
    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      id,
      { refreshToken },
      { new: true },
    );
    if (!updatedStudent) throw new HttpException('Student not found', 404);
    return updatedStudent;
  }
  async update(id: string, updateStudentDto: UpdateStudentDto) {
    // async update(id: string, updateStudentDto: Student) {
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
  // async addMaterial(id: string, materialId: string) {
  //   const updatedStudent = await this.studentModel.findByIdAndUpdate(
  //     id,
  //     {
  //       $push: {
  //         materials: new mongoose.Types.ObjectId(materialId),
  //       },
  //     },
  //     { new: true },
  //   );
  //   if (!updatedStudent)
  //     throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
  //   return updatedStudent;
  // }
  async remove(studentDto: DeleteStudentDto) {
    let { id: userId } = studentDto;
    const user = await this.studentModel
      .findOne({
        id: userId,
        email: studentDto.email,
      })
      .populate({
        path: 'materials',
      });
    if (!user) throw new HttpException('Student not found', 404);

    const isMatch = await bcrypt.compare(studentDto.password, user.password);
    if (!isMatch)
      throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED);
    await user.deleteOne();
    if (studentDto.deleteMaterials) {
      user.materials.forEach(async (material) => {
        await material.deleteOne();
      });
    }
    return { message: 'Deleted Account Successfully' };
  }
}
