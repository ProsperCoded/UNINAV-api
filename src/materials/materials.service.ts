import {
  BadRequestException,
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
import { isValidObjectId, Model } from 'mongoose';
import { Student } from 'src/students/schemas/students.schema';
import googleOauthConfig from 'src/config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { google } from 'googleapis';
import { StudentsService } from 'src/students/students.service';
import { STUDENT_MODEL_NAME } from 'src/config/config';
import { SearchPipeline } from './materials.aggregates';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectModel(MATERIAL_MODEL_NAME) private materialModel: Model<Material>,
    @InjectModel(STUDENT_MODEL_NAME) private studentModel: Model<Student>,

    @Inject(googleOauthConfig.KEY)
    private googleOauthConfigurations: ConfigType<typeof googleOauthConfig>,
    private studentsService: StudentsService,
  ) {}
  async create(owner: string, createMaterialDto: CreateMaterialDto) {
    let savedDocument;
    try {
      const newDocument = new this.materialModel({
        ...createMaterialDto,
        owner,
      });
      console.log('creating new document', createMaterialDto);
      const student = await this.studentModel.findByIdAndUpdate(
        owner,
        {
          $push: { materials: newDocument._id },
        },
        { new: true },
      );
      if (!student) throw new NotFoundException('Student not found');

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
      throw new BadRequestException(error.message);
    }
    return savedDocument;
  }

  findAll() {
    return this.materialModel.find().populate('owner');
  }

  async findOne(id: string) {
    const material = await this.materialModel.findById(id);
    if (!material) {
      throw new NotFoundException('Material with id Was not found ');
    }
    return material;
  }

  async update(
    id: string,
    owner: string,
    updateMaterialDto: UpdateMaterialDto,
  ) {
    const material = await this.materialModel.findById(id);
    if (!material) {
      throw new NotFoundException('Material with id Was not found ');
    }
    if (material.owner.toString() !== owner) {
      throw new HttpException(
        'You are not authorized to update this material',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const updatedMaterial = await this.materialModel.findByIdAndUpdate(
      id,
      updateMaterialDto,
      { new: true },
    );
    return updatedMaterial;
  }

  async remove(id: string, owner: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Material Id');
    }
    const material = await this.materialModel.findById(id);
    if (!material) {
      throw new NotFoundException('Material with id Was not found ');
    }
    if (material.owner.toString() !== owner) {
      throw new HttpException(
        'You are not authorized to delete this material',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await material.deleteOne();
    return { message: 'Deleted successfully' };
  }
  async search(query: string) {
    const aggregateResult = await this.materialModel.aggregate(
      SearchPipeline(query),
    );
    return aggregateResult;
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
