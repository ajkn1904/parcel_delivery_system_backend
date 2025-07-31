/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelper/AppError";

export const ensureUserNotDeleted = (user: any) => {
  if (!user || user.isDeleted) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Your Account has been Deleted! Create a New Account or Contact Support to Restore Your Account."
    );
  }
};