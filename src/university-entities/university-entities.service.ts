import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Faculty } from './schema/faculty.schema';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import {
  CreateDepartmentDto,
  CreateFacultyDto,
  CreateCourseDto,
} from './dto/create-univeristity-entities.dto';
import { Course } from './schema/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateDepartmentDto } from './dto/update-university-entities.dto';
import {
  COURSE_MODEL_NAME,
  DefaultFaculties,
  FACULTY_MODEL_NAME,
} from 'src/config/config';

@Injectable()
export class UniversityEntitiesService {
  constructor(
    @InjectModel(FACULTY_MODEL_NAME) private facultyModel: Model<Faculty>,
    @InjectModel(COURSE_MODEL_NAME) private courseModel: Model<Course>,
  ) {}
  async createFaculty(createFacultyDto: CreateFacultyDto) {
    try {
      const createdFaculty = new this.facultyModel(createFacultyDto);
      return await createdFaculty.save();
    } catch (error) {
      console.error('! An error occurred in creating faculty');
      console.log(error);
      throw new ForbiddenException('Faculty already exists', error.message);
    }
  }
  async getFaculties() {
    return await this.facultyModel.find();
  }
  async findFaculty(id: string) {
    if (!isValidObjectId(id)) {
      throw new ForbiddenException('Invalid faculty id');
    }
    const faculty = await this.facultyModel.findById(id);
    if (!faculty) {
      throw new NotFoundException("Faculty wasn't found");
    }
    return faculty;
  }
  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    const faculty = await this.facultyModel.findById(
      createDepartmentDto.facultyId,
    );
    if (!faculty) {
      throw new NotFoundException("Faculty wasn't found");
    }
    // check if department already exists
    const departmentExists = faculty.departments.some((department) => {
      return department.departmentName === createDepartmentDto.departmentName;
    });
    if (departmentExists) {
      throw new ForbiddenException('Department already exists');
    }
    // verify courses specified exist

    await Promise.all(
      createDepartmentDto.courses.map(async (course) => {
        const existingCourse = await this.courseModel.findById(course);
        if (!existingCourse) {
          throw new NotFoundException("Course wasn't found");
        }
      }),
    );
    const department = {
      _id: new mongoose.Types.ObjectId(),
      departmentName: createDepartmentDto.departmentName,
      courses: createDepartmentDto.courses,
    };
    faculty.departments.push(department);
    await faculty.save();
    return department;
  }
  async updateDepartment(updateDepartmentDto: UpdateDepartmentDto) {
    // let faculty: Document<Faculty>;
    const faculty = await this.facultyModel.findOne({
      departments: {
        $elemMatch: {
          _id: new mongoose.Types.ObjectId(updateDepartmentDto.id),
        },
      },
    });
    if (!faculty) {
      throw new NotFoundException("Department wasn't found");
    }
    let updatedDeptIndex;
    faculty.departments = faculty.departments.map((dept, index) => {
      if (dept._id.toString() === updateDepartmentDto.id) {
        let { id, ...prop } = updateDepartmentDto;
        updatedDeptIndex = index;
        return { ...dept, ...prop };
      }
      return dept;
    }) as any;
    await faculty.save();
    return faculty.toJSON().departments[updatedDeptIndex];
  }
  async getDepartments() {
    const allDepartments = [];
    try {
      (
        await this.facultyModel.find().populate({
          path: 'departments.courses',

          // model: Course.name,
        })
      ).forEach((faculty) => {
        allDepartments.push(...faculty.departments);
      });
    } catch (error) {
      console.error('! An error occurred in fetching departments');
      return { message: 'Error in fetching departments', data: error };
    }
    return allDepartments;
  }
  async createCourse(CreateCourseDto: CreateCourseDto) {
    try {
      const createdCourse = new this.courseModel(CreateCourseDto);
      await createdCourse.save();

      return createdCourse;
    } catch (error) {
      console.error('! An error occurred in creating course');
      console.log(error);
      throw new ForbiddenException('Error in course creation', error.message);
    }
  }
  async getCourses() {
    return await this.courseModel.find();
  }
  async generateDefaults() {
    const facultiesCreated = await Promise.all(
      DefaultFaculties.map(async (faculty) => {
        try {
          const createdFaculty = new this.facultyModel({
            facultyName: faculty.faculty,
            departments: faculty.departments.map((department) => ({
              _id: new mongoose.Types.ObjectId(),
              departmentName: department,
              courses: [],
            })),
          });
          await createdFaculty.save();
          return createdFaculty.toJSON();
        } catch (error) {
          console.error('! An error occurred in creating default faculties');
          console.log(error);
          throw new ForbiddenException(
            'Error in default faculties creation',
            error.message,
          );
        }
      }),
    );
    return facultiesCreated;
  }
}
