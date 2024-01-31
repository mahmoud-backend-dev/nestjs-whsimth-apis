
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

export class ArAndEr {
  @IsNotEmpty({ message: 'key en is required' })
  @IsString({ message: 'key ar is required' })
  ar: string;

  @IsNotEmpty({ message: 'key en is required' })
  @IsString({ message: 'key en is required' })
  en: string;
}

export class CreateStoreDto {
  @IsNotEmpty({ message: 'name must be object two keys ar and en' })
  @ValidateNested({ message: 'name must be object two keys ar and en' })
  @Type(() => ArAndEr)
  name: ArAndEr;

  @IsNotEmpty({ message: 'region must be object two keys ar and en' })
  @ValidateNested({ message: 'region must be object two keys ar and en' })
  @Type(() => ArAndEr)
  region: ArAndEr;

  @IsNotEmpty({ message: 'city must be object two keys ar and en' })
  @ValidateNested({ message: 'city must be object two keys ar and en' })
  @Type(() => ArAndEr)
  city: ArAndEr;
}