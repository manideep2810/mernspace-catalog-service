import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be a string"),
    body("description").exists().withMessage("description is required"),
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required"),
    body("attributes").exists().withMessage("Attributes field is required"),
    body("tenantId").exists().withMessage("tenant Id field is required"),
    body("categoryId").exists().withMessage("Category Id field is required"),
];
