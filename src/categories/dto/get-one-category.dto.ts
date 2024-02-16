import { CategoryExistOrNot } from "../validation/category-exist-or-not.rule";

export class GetOneCategoryIdParamDto {
  @CategoryExistOrNot()
  id: string;
}