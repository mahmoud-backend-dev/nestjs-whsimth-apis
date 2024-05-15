import { Type } from "class-transformer";
import { IsNotEmpty, MinLength, ValidateNested } from "class-validator";

export class ArAndEn {
  @MinLength(3, { message: 'ar is required' })
  ar: string;

  @MinLength(3, { message: 'en is required' })
  en: string;
}
export class AddSectionTwoDto {
  @IsNotEmpty()
  @ValidateNested({ message: 'label is object two keys ar an en' })
  @Type(() => ArAndEn)
  label: ArAndEn;

  @IsNotEmpty()
  @ValidateNested({message:'description is object two keys ar an en'})
  @Type(() => ArAndEn)
  description: ArAndEn;
}