import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { acceptableMaterialTypes, AcceptableMaterialTypes } from '../types';
import { Student } from 'src/students/schemas/students.schema';
import { STUDENT_MODEL_NAME } from 'src/config/config';
export const MATERIAL_MODEL_NAME = 'Material';
@Schema()
export class Material extends Document {
  @Prop({ type: String, enum: acceptableMaterialTypes, required: true })
  type: AcceptableMaterialTypes;

  @Prop({ required: true, type: String })
  resourceAddress: string;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ type: Number, default: 0 })
  clickCount: number;
  theme;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: STUDENT_MODEL_NAME,
  })
  owner: Student;

  @Prop({ type: String })
  label: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    type: {
      // only applicable for GDrive type
      files: [String],
    },
    default: null,
    required: false,
  })
  metaData: { files: string[] };
}
// create actual schema for class
export const MaterialSchema = SchemaFactory.createForClass(Material);
