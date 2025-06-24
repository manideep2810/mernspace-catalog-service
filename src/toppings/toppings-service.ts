import toppingModel from "./toppings-model";
import { Topping } from "./toppings-types";

export class ToppingService {
    async create(topping: Topping) {
        return await toppingModel.create(topping);
    }

    async getAll(tenantId: string) {
        return await toppingModel.find({ tenantId });
    }
}
