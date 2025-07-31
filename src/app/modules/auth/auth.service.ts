/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTookens";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/env";

const getNewAccessToken = async (refreshToken: string) => {

 const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken
  };
};



const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

 const user = await User.findById(decodedToken.userId);

 const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

 if(!isOldPasswordMatch){
  throw new AppError(StatusCodes.UNAUTHORIZED, "Old Password Does Not Match!");
 };

 user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

 user!.save();

};



export const AuthService = {
  getNewAccessToken,
  resetPassword
};
