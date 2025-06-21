import { Router } from "express";
import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { ROLES } from "../common/types";
import { ProductController } from "./product-controller";
import createProductValidator from "./create-product-validator";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";

const router = Router();

const productService = new ProductService();
const productController = new ProductController(productService);

router.post(
    "/",
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]),
    fileUpload(),
    createProductValidator,
    asyncWrapper(productController.create),
);

export default router;
