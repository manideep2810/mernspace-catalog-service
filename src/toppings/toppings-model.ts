import mongoose from "mongoose";
import { Topping } from "./toppings-types";

const toppingsSchema = new mongoose.Schema<Topping>(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
        isPublish: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export default mongoose.model("ToppingsModel", toppingsSchema);
