import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Course {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 50,
  })
  courseName: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
    minlength: 6,
    maxlength: 6,
  })
  courseCode: string;

  @Prop({ required: false, type: String, minlength: 10, maxlength: 500 })
  description?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
