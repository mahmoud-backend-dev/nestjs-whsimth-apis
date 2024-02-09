import { Type } from 'class-transformer';
import { IsNotEmpty, MinLength, ValidateNested } from 'class-validator';

export class ArAndEn {
  @MinLength(3, { message: 'key ar must be at least 3 characters' })
  ar: string;

  @MinLength(3, { message: 'key en must be at least 3 characters' })
  en: string;
}

export class CreateStoreDto {
  @IsNotEmpty({ message: 'name must be object two keys ar and en' })
  @ValidateNested({ message: 'name must be object two keys ar and en' })
  @Type(() => ArAndEn)
  name: ArAndEn;

  @IsNotEmpty({ message: 'region must be object two keys ar and en' })
  @ValidateNested({ message: 'region must be object two keys ar and en' })
  @Type(() => ArAndEn)
  region: ArAndEn;

  @IsNotEmpty({ message: 'city must be object two keys ar and en' })
  @ValidateNested({ message: 'city must be object two keys ar and en' })
  @Type(() => ArAndEn)
  city: ArAndEn;
}
