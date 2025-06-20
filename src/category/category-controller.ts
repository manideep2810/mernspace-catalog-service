import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category, PriceConfiguration } from "./category-types";
import { CategoryService } from "./catergory-service";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getOne = this.getOne.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.update = this.update.bind(this);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, priceConfiguration, attributes } = req.body as Category;

        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });

        this.logger.info(`Created a Category`, { id: category._id });
        res.json({ id: category._id });
    }

    async getAll(req: Request, res: Response) {
        const categories = await this.categoryService.getAll();
        this.logger.info(`Feteched all categories`, {
            count: categories.length,
        });
        res.json(categories);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const category = await this.categoryService.getOne(id);
        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }
        res.json(category);
    }

    async deleteCategory(req: Request, res: Response) {
        const { id } = req.params;
        await this.categoryService.deleteCategory(id);
        this.logger.info(`Deleted a Category`, { id });
        res.json({});
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const categoryId = req.params.id;
        const updateData = req.body as Partial<Category>;

        const existingCategory = await this.categoryService.getOne(categoryId);

        if (!existingCategory) {
            return next(createHttpError(404, "Category not found"));
        }

        if (updateData.priceConfiguration) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const existingConfig: PriceConfiguration =
                existingCategory.priceConfiguration instanceof Map
                    ? Object.fromEntries(existingCategory.priceConfiguration)
                    : existingCategory.priceConfiguration;

            const mergedConfig: PriceConfiguration = {
                ...existingConfig,
                ...updateData.priceConfiguration,
            };

            updateData.priceConfiguration = mergedConfig;
        }

        const updatedCategory = await this.categoryService.update(
            categoryId,
            updateData,
        );

        this.logger.info(`Updated category`, { id: categoryId });

        res.json({
            id: updatedCategory?._id,
        });
    }
}
