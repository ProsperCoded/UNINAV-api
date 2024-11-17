import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-univeristity-entities.dto';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @IsMongoId()
  id: string;
}
