import express from "express";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { ROLES } from "../common/types";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import { ToppingController } from "./toppings-controller";
import { ToppingService } from "./toppings-service";
import { S3Storage } from "../common/services/S3Storage";
import { asyncWrapper } from "../common/utils/wrapper";

const router = express.Router();

const toppingService = new ToppingService();
const storage = new S3Storage();
const toppingsController = new ToppingController(storage, toppingService);

router.post(
    "/",
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    asyncWrapper(toppingsController.create),
);

router.get("/", asyncWrapper(toppingsController.get));

export default router;
