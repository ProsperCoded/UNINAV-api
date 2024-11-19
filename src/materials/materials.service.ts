import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Material, MATERIAL_MODEL_NAME } from './schemas/material.schema';
import { Model } from 'mongoose';
import {
  Student,
} from 'src/students/schemas/students.schema';
import googleOauthConfig from 'src/config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { google } from 'googleapis';
import { StudentsService } from 'src/students/students.service';
import { STUDENT_MODEL_NAME } from 'src/config/config';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectModel(MATERIAL_MODEL_NAME) private materialModel: Model<Material>,
    @InjectModel(STUDENT_MODEL_NAME) private studentModel: Model<Student>,

    @Inject(googleOauthConfig.KEY)
    private googleOauthConfigurations: ConfigType<typeof googleOauthConfig>,
    private studentsService: StudentsService,
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

      if (createMaterialDto.type === 'GDrive') {
        const folderUrl = new URL(createMaterialDto.resourceAddress);
        const folderId = folderUrl.pathname.split('/').pop();
        const fileList = await this.listPublicFolderFiles(
          this.googleOauthConfigurations.apiKey,
          folderId,
        );
        newDocument.metaData = { files: fileList.map((f) => f.name) };
      }
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

  async findOne(id: string) {
    const material = await this.materialModel.findById(id);
    if (!material) {
      throw new NotFoundException('Material with id Was not found ');
    }
    return material;
  }

  update(id: number, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} material`;
  }

  remove(id: number) {
    return `This action removes a #${id} material`;
  }
  private async listPublicFolderFiles(apiKey: string, folderId: string) {
    const drive = google.drive({ version: 'v3', auth: apiKey });
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      pageSize: 10,
      fields: 'files(id, name)',
    });
    console.log('Files:', res.data);
    return res.data.files;
  }
}
