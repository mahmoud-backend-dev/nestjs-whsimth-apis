import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { ArAndEn } from "./create-category.dto";


export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'name must be object two keys ar and en' })
  @ValidateNested({ message: 'name must be object two keys ar and en' })
  @Type(() => ArAndEn)
  name: ArAndEn;
}