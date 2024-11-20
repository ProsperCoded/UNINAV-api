import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Collection } from './collections.schema';
import { isValidObjectId, Model } from 'mongoose';
import { MaterialsService } from 'src/materials/materials.service';
import { Student } from 'src/students/schemas/students.schema';
import { StudentsService } from 'src/students/students.service';
import {
  COLLECTION_MODEL_NAME,
  MATERIAL_MODEL_NAME,
  STUDENT_MODEL_NAME,
} from 'src/config/config';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(COLLECTION_MODEL_NAME)
    private collectionsModel: Model<Collection>,
    @InjectModel(STUDENT_MODEL_NAME) private studentModel: Model<Student>,
    private readonly studentService: StudentsService,
    private readonly materialsService: MaterialsService,
  ) {}
  async create(owner: string, createCollectionDto: CreateCollectionDto) {
    const collection = new this.collectionsModel({
      ...createCollectionDto,
      owner,
    });
    // verify collection.materials exists
    await Promise.all(
      createCollectionDto.materials.map(async (materialId) => {
        await this.materialsService.findOne(materialId);
      }),
    );
    const student = await this.studentService.findOne(owner);
    student.collections.push(collection._id as any);
    await collection.save();
    await student.save();
    return collection;
  }

  async findAll() {
    return await this.collectionsModel
      .find()
      .populate({ path: 'materials', model: MATERIAL_MODEL_NAME });
  }

  findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new ForbiddenException('Invalid collection id');
    }
    return this.collectionsModel
      .findById(id)
      .populate({ path: 'materials', model: MATERIAL_MODEL_NAME });
  }

  async update(
    id: string,
    owner: string,
    updateCollectionDto: UpdateCollectionDto,
  ) {
    if (!isValidObjectId(id)) {
      throw new ForbiddenException('Invalid collection id');
    }
    // todo verify if collection.owner is same as studentId
    const collection = await this.collectionsModel.findById(id);
    if (collection.owner.toString() !== owner) {
      throw new UnauthorizedException(
        "You aren't authorized to update this collection",
      );
    }
    // * verify if materials exists
    if (updateCollectionDto.materials) {
      updateCollectionDto.materials.forEach(async (materialId) => {
        await this.materialsService.findOne(materialId);
      });
    }
    const updatedCollection = await this.collectionsModel
      .findByIdAndUpdate(
        id,

        updateCollectionDto,
        {
          new: true,
        },
      )
      .populate({ path: 'materials', model: MATERIAL_MODEL_NAME });
    return { collection: updatedCollection, message: 'Updated Successfully' };
  }

  async remove(id: string, owner: string) {
    if (!isValidObjectId(id)) {
      throw new ForbiddenException('Invalid collection id');
    }
    const collection = await this.collectionsModel.findById(id);
    if (!collection) {
      throw new ForbiddenException('Collection not found');
    }
    if (collection.owner.toString() !== owner) {
      throw new UnauthorizedException(
        "You aren't authorized to delete this collection",
      );
    }
    await collection.deleteOne();
    return { message: 'Deleted Successfully' };
  }
}
