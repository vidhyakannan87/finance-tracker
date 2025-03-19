import { Controller, Get, Param } from '@nestjs/common';
import {
  SpendingCategory,
  Subcategories,
} from 'src/common/spending-category.enum';

@Controller('categories')
export class CategoriesController {
  @Get()
  getCategories() {
    return SpendingCategory;
  }

  @Get(':category/subcategories')
  getSubcategories(@Param('category') category: string) {
    const formattedCategory = category.toUpperCase();
    const categoryKey = Object.keys(SpendingCategory).find(
      (key) => key === formattedCategory,
    ) as keyof typeof SpendingCategory;

    if (!categoryKey) {
      return [];
    }

    return Subcategories[SpendingCategory[categoryKey]] || [];
  }
}
