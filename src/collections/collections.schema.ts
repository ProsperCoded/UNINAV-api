import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Material } from 'src/materials/schemas/material.schema';
import { Student } from 'src/students/schemas/students.schema';
import { SchemaFactory } from '@nestjs/mongoose';
import { MATERIAL_MODEL_NAME, STUDENT_MODEL_NAME } from 'src/config/config';

@Schema()
export class Collection {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: STUDENT_MODEL_NAME,
    required: true,
  })
  owner: Student;

  @Prop({
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: MATERIAL_MODEL_NAME,
      },
    ],
    default: [],
  })
  materials: Material[];

  @Prop({
    type: [String],
    required: false,
  })
  tags: string[];
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
