import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Filter, Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { UploadedFile } from "express-fileupload";
import { AuthRequest } from "../common/types";
import mongoose from "mongoose";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
    ) {}
    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const image = req.files!.image as UploadedFile;
        const imageName = `${uuidv4()}.jpeg`;

        await this.storage.upload({
            filename: imageName,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fileData: image.data.buffer,
        });

        const {
            name,
            description,
            priceConfiguration,
            categoryId,
            tenantId,
            attributes,
            isPublish,
        } = req.body as Product;
        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration),
            attributes: JSON.parse(attributes),
            categoryId,
            tenantId,
            isPublish,
            image: imageName,
        };

        const newProduct = await this.productService.createProduct(
            product as unknown as Product,
        );
        res.json({ id: newProduct._id });
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { productId } = req.params;

        if ((req as AuthRequest).auth.role !== "admin") {
            const Iproduct = await this.productService.getProduct(productId);

            if (!Iproduct) {
                return next(createHttpError(404, "Product not found"));
            }

            const tenant = (req as AuthRequest).auth.tenantId;
            if (Iproduct.tenantId !== String(tenant)) {
                return next(
                    createHttpError(
                        403,
                        "You are not allowed to update this product",
                    ),
                );
            }
        }

        let imageName: string | undefined;
        let oldImage: string | undefined;

        if (req.files?.image) {
            oldImage = await this.productService.getProductImage(productId);

            const image = req.files?.image as UploadedFile;
            imageName = `${uuidv4()}.jpeg`;

            await this.storage.upload({
                filename: imageName,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                fileData: image.data.buffer,
            });

            if (oldImage) {
                await this.storage.delete(oldImage);
            }
        }

        const {
            name,
            description,
            priceConfiguration,
            categoryId,
            tenantId,
            attributes,
            isPublish,
        } = req.body as Product;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration),
            attributes: JSON.parse(attributes),
            categoryId,
            tenantId,
            isPublish,
            image: imageName ? imageName : (oldImage as string),
        };

        await this.productService.updateProduct(productId, product);

        res.json({ id: productId });
    };

    index = async (req: Request, res: Response) => {
        const { q, tenantId, categoryId, isPublish } = req.query;

        const filters: Filter = {};

        if (isPublish === "true") {
            filters.isPublish = true;
        }

        if (tenantId) {
            filters.tenantId = String(tenantId);
        }

        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }

        const products = await this.productService.getProducts(
            q as string,
            filters,
        );

        res.json(products);
    };
}
