import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Course } from './course.schema';

@Schema()
export class Faculty {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String, unique: true })
  facultyName: string;

  @Prop({
    required: false,
    type: [
      {
        // _id: mongoose.Types.ObjectId,
        departmentName: { type: String, unique: true },
        courses: [
          {
            type: mongoose.Schema.ObjectId,
            ref: Course.name,
          },
        ],
      },
    ],
    default: [],
  })
  departments: [
    {
      _id: mongoose.Types.ObjectId;
      departmentName: string;
      courses: string[];
    },
  ];
}
export const FacultySchema = SchemaFactory.createForClass(Faculty);

// DepartmentSchema.index({ name: 1 }, { unique: true, sparse: true });
// Generate
