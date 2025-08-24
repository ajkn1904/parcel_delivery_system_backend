import express, { Request, Response } from 'express'
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFoundRoute';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { envVars } from './app/config/env';
import expressSession from "express-session";
import "./app/config/passport"

const app = express();


app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());


app.use(express.json());
app.use(cors({
  origin: [envVars.FRONTEND_URL],
  credentials: true
}));

app.use("/api", router)


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Parcel Delivery System Server!",
  });
});



app.use(globalErrorHandler);
app.use(notFound);
export default app;
