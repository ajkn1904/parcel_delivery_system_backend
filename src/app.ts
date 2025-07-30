import express, { Request, Response } from 'express'
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFoundRoute';


const app = express();


app.use(express.json());
app.use(cors());

app.use("/api", router)


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Parcel Delivery System Server!",
  });
});



app.use(globalErrorHandler);
app.use(notFound);
export default app;
