import { Type } from "class-transformer";
import { IsOptional, MinLength, ValidateNested } from "class-validator";
import { ProductExistOrNot } from "../validation/product-exist-or-not.rule";
import { Product } from "src/products/schema/product.schema";


export class ArAndEn{
  @MinLength(3, { message: 'ar is required' })
  ar: string;
  @MinLength(3, { message: 'en is required' })
  en: string;
}

export class AddSectionOneDto {
  @ValidateNested({
    message:
      'label is required and must be an object with ar and en properties',
  })
  @Type(() => ArAndEn)
  label: ArAndEn;

  @ValidateNested({
    message:
      'description is required and must be an object with ar and en properties',
  })
  @Type(() => ArAndEn)
  description: ArAndEn;

  @IsOptional()
  @ProductExistOrNot()
  products:Product[]
}