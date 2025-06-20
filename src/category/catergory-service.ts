import categoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new categoryModel(category);
        return newCategory.save();
    }

    async getAll() {
        return await categoryModel.find();
    }

    async getOne(id: string) {
        return await categoryModel.findOne({ _id: id });
    }

    async deleteCategory(id: string) {
        const category = await categoryModel.findByIdAndDelete(id);
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }

    async update(
        categoryId: string,
        updateData: Partial<Category>,
    ): Promise<({ _id: string } & Category) | null> {
        return await categoryModel.findByIdAndUpdate(
            categoryId,
            { $set: updateData },
            { new: true },
        );
    }
}
