import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";
import { handleZodError } from "../utils/errorHelpers/handleZodError";

export const validationRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);

        // Send proper JSON response
        return res.status(simplifiedError.statusCode).json({
          success: false,
          message: simplifiedError.message,
          err: simplifiedError.errorSources,
        });
      }
      next(error);
    }
  };
