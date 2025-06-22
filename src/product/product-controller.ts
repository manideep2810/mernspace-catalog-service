import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { UploadedFile } from "express-fileupload";

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
            image: "image.jpeg",
        };

        const newProduct = await this.productService.createProduct(
            product as unknown as Product,
        );
        res.json({ id: newProduct._id });
    };
}
