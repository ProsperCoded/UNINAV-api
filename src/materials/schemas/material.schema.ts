import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { acceptableMaterialTypes, AcceptableMaterialTypes } from '../types';
import { Student } from 'src/students/schemas/students.schema';
@Schema()
export class Material extends Document {
  @Prop({ type: String, enum: acceptableMaterialTypes, required: true })
  type: AcceptableMaterialTypes;

  @Prop({ required: true, type: String })
  resourceAddress: string;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ type: Number, default: 0 })
  downloadCount: number;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'Student' })
  owner: Student;

  @Prop({ type: String })
  label: string;

  @Prop({ type: String })
  description: string;
}
// create actual schema for class
export const MaterialSchema = SchemaFactory.createForClass(Material);
