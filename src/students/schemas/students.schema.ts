import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Material } from 'src/materials/schemas/material.schema';
import { Collection } from 'src/collections/collections.schema';
import { Faculty } from 'src/university-entities/schema/faculty.schema';
import { COURSE_MODEL_NAME, FACULTY_MODEL_NAME } from 'src/config/config';
import { Course } from 'src/university-entities/schema/course.schema';

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
  @Prop({ type: mongoose.Schema.ObjectId, unique: false, required: false })
  department: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.ObjectId,
    unique: false,
    required: false,
    ref: FACULTY_MODEL_NAME,
  })
  faculty: Faculty;

  @Prop({
    type: [mongoose.Schema.ObjectId],
    required: false,
    ref: COURSE_MODEL_NAME,
  })
  courses: Course[];

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
