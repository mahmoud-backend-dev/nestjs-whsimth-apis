import { Type } from 'class-transformer';
import { IsOptional, MinLength, ValidateNested } from 'class-validator';

export class ArAndEn {
  @MinLength(3, { message: 'ar is required' })
  ar: string;
  @MinLength(3, { message: 'en is required' })
  en: string;
}

export class UpdateMainSectionDto {
  @IsOptional()
  @ValidateNested({
    message: 'h1 is required and must be an object with ar and en properties',
  })
  @Type(() => ArAndEn)
  h1: ArAndEn;

  @IsOptional()
  @ValidateNested({
    message: 'h2 is required and must be an object with ar and en properties',
  })
  @Type(() => ArAndEn)
  h2: ArAndEn;

  @IsOptional()
  @ValidateNested({
    message: 'h3 is required and must be an object with ar and en properties',
  })
  @Type(() => ArAndEn)
  h3: ArAndEn;
}
