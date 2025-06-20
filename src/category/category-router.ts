import { Router } from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./catergory-service";
import logger from "../config/logger";
import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { ROLES } from "../common/types";
import categoryUpdateValidator from "./category-update-validator";

const router = Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    canAccess([ROLES.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.create),
);

router.get("/", asyncWrapper(categoryController.getAll));

router.get("/:id", asyncWrapper(categoryController.getOne));

router.delete(
    "/:id",
    authenticate,
    canAccess([ROLES.ADMIN]),
    asyncWrapper(categoryController.deleteCategory),
);

router.patch(
    "/:id",
    authenticate,
    canAccess([ROLES.ADMIN]),
    categoryUpdateValidator,
    asyncWrapper(categoryController.update),
);

export default router;
