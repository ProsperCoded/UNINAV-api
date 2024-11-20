import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  name: string;

  @IsString()
  @Length(10, 500)
  description: string;

  @IsMongoId({ each: true })
  @IsNotEmpty({ each: true })
  materials: string[];

  @IsString({ each: true })
  tags: string[];
}
