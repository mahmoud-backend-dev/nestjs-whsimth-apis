import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ArAndEn {
  @MinLength(3, { message: 'key ar must be at least 3 characters' })
  ar: string;
  @MinLength(3, { message: 'key en must be at least 3 characters' })
  en: string;
}

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'name must be object two keys ar and en' })
  @ValidateNested({ message: 'name must be object two keys ar and en' })
  @Type(() => ArAndEn)
  name: ArAndEn;
}
