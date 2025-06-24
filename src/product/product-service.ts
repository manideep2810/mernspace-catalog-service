import createHttpError from "http-errors";
import { FileStorage } from "../common/types/storage";
import productModel from "./product-model";
import { Filter, Product } from "./product-types";

export class ProductService {
    constructor(private storage: FileStorage) {}
    async createProduct(product: Product) {
        return await productModel.create(product);
    }

    async getProductImage(productId: string) {
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        return product.image;
    }

    async updateProduct(productId: string, product: Product) {
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            product,
            { new: true },
        );
        if (!updatedProduct) {
            throw new Error("Product not found");
        }
        return updatedProduct;
    }

    async getProduct(productId: string) {
        const product = await productModel.findById(productId);
        return product;
    }

    async getProducts(q: string, filters: Filter) {
        const searchQueryRegexp = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: searchQueryRegexp,
        };

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        const result = (await aggregate.exec()) as Product[];
        const updatedProducts = result.map((product: Product) => {
            return {
                ...product,
                image: this.storage.getObjectURI(product.image),
            };
        });

        return updatedProducts;
    }

    async deleteProduct(productId: string) {
        const product = await productModel.findById(productId);
        if (!product) {
            const err = createHttpError(400, "Product Not Found");
            throw err;
        }
        await this.storage.delete(product.image);
        return await productModel.findByIdAndDelete(productId);
    }
}
