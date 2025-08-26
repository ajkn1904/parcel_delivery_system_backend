/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { createUserTokens } from "../../utils/userTookens";
import { setAuthCookie } from "../../utils/setCookie";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { ensureUserNotDeleted } from "../../utils/checkDeletedUser";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  passport.authenticate("local", async (error: any, user: any, info:any) => {
    if(error){
      return next(new AppError(StatusCodes.NOT_FOUND, error))
    }
    if(!user){
      return next(new AppError(StatusCodes.NOT_FOUND, info.message))
    };

    try {
        ensureUserNotDeleted(user);
    } catch (err) {
        return next(err);
    }


    const userToken = await createUserTokens(user);
    setAuthCookie(res, userToken);

    const {password, ...rest} = user.toObject();
    ensureUserNotDeleted(user);
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User Logged in Successfully",
      data: {
        accessToken : userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
      },
    });

  })(req, res, next);
  
});


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    throw new AppError(StatusCodes.BAD_REQUEST, "No Refresh Token Received from Cookies.");
  }

  const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);


  setAuthCookie(res, tokenInfo)


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "New Access Token Retrieved Successfully",
    data: tokenInfo,
  });
});


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  })

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged Out Successfully",
    data: null,
  });
});


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password Changed Successfully",
    data: null,
  });
});


const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
  let redirectTo = req.query.state ? req.query.state as string : "";
  if(redirectTo.startsWith("/")){
    redirectTo = redirectTo.slice(1)
  };

  const user = req.user;
  if(!user){
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  };
  try {
        ensureUserNotDeleted(user);
    } catch (err) {
        return next(err);
    }

  const tokenInfo = createUserTokens(user);

  setAuthCookie(res, tokenInfo);

  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
});



export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController

};
