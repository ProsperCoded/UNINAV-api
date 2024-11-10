import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Material } from './schemas/material.schema';
import { Model } from 'mongoose';
import { Student, StudentSchema } from 'src/students/schemas/students.schema';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<Material>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}
  async create(createMaterialDto: CreateMaterialDto) {
    let savedDocument;
    try {
      const newDocument = new this.materialModel(createMaterialDto);
      console.log('creating new document', createMaterialDto);
      const student = await this.studentModel.findById(
        createMaterialDto.owner,
        {
          $push: { materials: newDocument._id },
        },
        { new: true },
      );
      if (!student)
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      savedDocument = await newDocument.save();

      console.log('Document Saved Successfully');
    } catch (error) {
      console.error('an error occurred in creating and saving document', error);
      return error.message;
    }
    return savedDocument;
  }

  findAll() {
    return this.materialModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} material`;
  }

  update(id: number, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} material`;
  }

  remove(id: number) {
    return `This action removes a #${id} material`;
  }
}
