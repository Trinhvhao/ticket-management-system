import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  /**
   * Create a new category
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category with same name exists
    const existingCategory = await this.categoryModel.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.categoryModel.create(createCategoryDto as any);
  }

  /**
   * Get all categories
   */
  async findAll(includeInactive = false): Promise<Category[]> {
    const where = includeInactive ? {} : { isActive: true };
    
    return this.categoryModel.findAll({
      where,
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
    });
  }

  /**
   * Get active categories only
   */
  async findActive(): Promise<Category[]> {
    return this.categoryModel.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
    });
  }

  /**
   * Get category by ID
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryModel.findByPk(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Update category
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Check if new name conflicts with existing category
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryModel.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    await category.update(updateCategoryDto);
    return category;
  }

  /**
   * Delete category (soft delete if has tickets)
   */
  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);

    // Check if category can be deleted
    if (!category.canBeDeleted()) {
      throw new ConflictException('Cannot delete category with existing tickets');
    }

    await category.destroy();
    return { message: 'Category deleted successfully' };
  }

  /**
   * Activate category
   */
  async activate(id: number): Promise<Category> {
    const category = await this.findOne(id);
    category.activate();
    await category.save();
    return category;
  }

  /**
   * Deactivate category
   */
  async deactivate(id: number): Promise<Category> {
    const category = await this.findOne(id);
    category.deactivate();
    await category.save();
    return category;
  }

  /**
   * Reorder categories
   */
  async reorder(categoryIds: number[]): Promise<{ message: string }> {
    const promises = categoryIds.map((id, index) =>
      this.categoryModel.update(
        { displayOrder: index },
        { where: { id } },
      ),
    );

    await Promise.all(promises);
    return { message: 'Categories reordered successfully' };
  }

  /**
   * Get category statistics
   */
  async getStats(id: number): Promise<any> {
    const category = await this.findOne(id);
    
    return {
      id: category.id,
      name: category.name,
      ticketCount: category.ticketCount,
      isActive: category.isActive,
    };
  }
}
