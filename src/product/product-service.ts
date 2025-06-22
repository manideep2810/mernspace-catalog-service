import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
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
}
