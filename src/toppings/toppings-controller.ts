import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { FileStorage } from "../common/types/storage";
import { ToppingService } from "./toppings-service";
import { CreataeRequestBody, Topping } from "./toppings-types";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import createHttpError from "http-errors";

export class ToppingController {
    constructor(
        private storage: FileStorage,
        private toppingService: ToppingService,
    ) {}
    create = async (
        req: Request<object, object, CreataeRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            next(createHttpError(400, result.array()[0].msg as string));
        }
        try {
            const image = req.files!.image as UploadedFile;
            const fileUuid = uuidv4() as unknown as string;

            await this.storage.upload({
                filename: fileUuid,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                fileData: image.data.buffer,
            });

            const savedTopping = await this.toppingService.create({
                ...req.body,
                image: fileUuid,
                tenantId: req.body.tenantId,
            } as Topping);

            res.json({ id: savedTopping._id });
        } catch (err) {
            return next(err);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const toppings = await this.toppingService.getAll(
                req.query.tenantId as string,
            );

            const readyToppings = toppings.map((topping) => {
                return {
                    id: topping._id,
                    name: topping.name,
                    price: topping.price,
                    tenantId: topping.tenantId,
                    image: this.storage.getObjectURI(topping.image),
                };
            });
            res.json(readyToppings);
        } catch (err) {
            return next(err);
        }
    };
}
