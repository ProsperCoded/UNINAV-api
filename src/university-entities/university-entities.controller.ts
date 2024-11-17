import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { UniversityEntitiesService } from './university-entities.service';
import {
  CreateCourseDto,
  CreateDepartmentDto,
  CreateFacultyDto,
} from './dto/create-univeristity-entities.dto';
import { UpdateDepartmentDto } from './dto/update-university-entities.dto';

@Controller('university-entities')
export class UniversityEntitiesController {
  constructor(
    private readonly universityEntitiesService: UniversityEntitiesService,
  ) {}

  @Post('faculty')
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.universityEntitiesService.createFaculty(createFacultyDto);
  }
  @Get('faculty')
  getFaculties() {
    return this.universityEntitiesService.getFaculties();
  }
  @Post('department')
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.universityEntitiesService.createDepartment(createDepartmentDto);
  }
  @Patch('department')
  updateDepartment(@Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.universityEntitiesService.updateDepartment(updateDepartmentDto);
  }
  @Get('department')
  getDepartments() {
    return this.universityEntitiesService.getDepartments();
  }
  @Post('course')
  createCourse(@Body() createFacultyDto: CreateCourseDto) {
    return this.universityEntitiesService.createCourse(createFacultyDto);
  }
  @Get('course')
  getCourses() {
    return this.universityEntitiesService.getCourses();
  }
  @Post('generate')
  generateData() {
    return this.universityEntitiesService.generateDefaults();
  }
}
