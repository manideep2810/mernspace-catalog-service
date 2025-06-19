import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import CategoryRouter from "./category/category-router";

const app = express();
app.use(express.json());

app.use("/categories", CategoryRouter);
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello From catalog-service" });
});

app.use(globalErrorHandler);

export default app;
