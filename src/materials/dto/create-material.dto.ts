import { ArrayMaxSize, IsIn, IsInt, IsString } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { acceptableMaterialTypes, AcceptableMaterialTypes } from '../types';

export class CreateMaterialDto {
  @IsString()
  label: string;

  @IsString()
  description: string;

  @IsString()
  resourceAddress: string;

  @IsMongoId()
  owner: string;

  @IsString()
  @IsIn(acceptableMaterialTypes)
  type: AcceptableMaterialTypes;

  @IsString({ each: true })
  @ArrayMaxSize(5)
  tags: string[];
}
