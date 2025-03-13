import { Controller, Get, Param } from '@nestjs/common';
import {
  SpendingCategory,
  Subcategories,
} from 'src/common/spending-category.enum';

@Controller('categories')
export class CategoriesController {
  @Get()
  getCategories() {
    return Object.values(SpendingCategory);
  }

  @Get(':category/subcategories')
  getSubcategories(@Param('category') category: SpendingCategory) {
    return Subcategories[category] || [];
  }
}
