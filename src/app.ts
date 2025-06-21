import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import CategoryRouter from "./category/category-router";
import ProductRouter from "./product/product-router";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/categories", CategoryRouter);
app.use("/products", ProductRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello From catalog-service" });
});

app.use(globalErrorHandler);

export default app;
