import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Material } from 'src/materials/schemas/material.schema';
import { Collection } from 'src/collections/collections.schema';

@Schema()
export class Student extends Document {
  _id: ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ type: String, required: false })
  password?: string;

  @Prop({ required: false, type: String })
  matricNumber: string;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Material.name }],
    default: [],
  })
  // materials: Material[];
  materials: Material[];
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Collection.name }],
    default: [],
  })
  collections: Collection[];
  // @Prop({}) collection of materials

  // optional data
  @Prop({ unique: false, required: false })
  department: string;

  @Prop({ unique: false, required: false })
  faculty: string;

  @Prop({ unique: false, required: false })
  courses: string[];

  @Prop({ type: String })
  refreshToken?: string;

  @Prop({ type: String, required: false })
  avaterUrl?: string;

  @Prop({ type: String, required: false })
  googleRefreshToken?: string;

  @Prop({ type: String, required: false })
  googleAccessToken?: string;
}
// create actual schema for class
export const StudentSchema = SchemaFactory.createForClass(Student);

// add a unique sparse index on 'matricNumber'
StudentSchema.index({ email: 1 }, { unique: true, sparse: true });
