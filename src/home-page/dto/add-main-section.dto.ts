import { Type } from "class-transformer";
import { MinLength, ValidateNested } from "class-validator";

export class ArAndEn{
  @MinLength(3, { message: 'ar is required' })
  ar: string;
  @MinLength(3, { message: 'en is required' })
  en: string;
}

export class AddMainSectionDto{
  @ValidateNested({ message: 'h1 is required and must be an object with ar and en properties' })
  @Type(() => ArAndEn)
  h1: ArAndEn;

  @ValidateNested({ message: 'h2 is required and must be an object with ar and en properties' })
  @Type(() => ArAndEn)
  h2: ArAndEn;

  @ValidateNested({ message: 'h3 is required and must be an object with ar and en properties' })
  @Type(() => ArAndEn)
  h3: ArAndEn;
}