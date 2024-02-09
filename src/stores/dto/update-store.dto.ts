import { Type } from "class-transformer";
import {
  IsOptional,
  MinLength,
  ValidateNested
} from "class-validator";
import { StoreExistOrNot } from "../validation/store-exist-or-not.rule";

export class ArAndEn{

  @MinLength(3, { message: 'key ar must be at least 3 characters' })
  ar: string;

  @MinLength(3, { message: 'key en must be at least 3 characters' })
  en: string;
}

export class UpdateStoreBodyDto {

  @IsOptional()
  @ValidateNested({ message: 'name must be object two keys ar and en' })
  @Type(() => ArAndEn)
  name: ArAndEn;

  @IsOptional()
  @ValidateNested({ message: 'region must be object two keys ar and en' })
  @Type(() => ArAndEn)
  region: ArAndEn;

  @IsOptional()
  @ValidateNested({ message: 'city must be object two keys ar and en' })
  @Type(() => ArAndEn)
  city: ArAndEn;
}


export class UpdateStoreIdParamDto {
  @StoreExistOrNot()
  id: string;
}