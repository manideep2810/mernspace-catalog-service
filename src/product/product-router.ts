import { Router } from "express";
import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { ROLES } from "../common/types";
import { ProductController } from "./product-controller";
import createProductValidator from "./create-product-validator";

const router = Router();

const productController = new ProductController();

router.post(
    "/",
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]),
    createProductValidator,
    asyncWrapper(productController.create),
);

export default router;
