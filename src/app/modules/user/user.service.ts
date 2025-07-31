import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exists");
  }

  const authsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authsProvider],
    ...rest,
  });
  return user;
};


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  
  const ifUserExists = await User.findById(userId);
  if(!ifUserExists){
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  };


  if((payload.role === Role.admin || payload.isBlocked || payload.isDeleted) && (decodedToken.role === Role.sender || decodedToken.role === Role.receiver)){
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized!");
  };

  if (payload.email) {
    throw new AppError(StatusCodes.FORBIDDEN, "Email cannot be changed");
  };

  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
  };

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true});

  return newUpdatedUser;

};



const getAllUsers = async () => {

  const users = await User.find({isDeleted: { $ne: true }});
  const totalUsers = await User.countDocuments({isDeleted: { $ne: true }});

  return {
    users,
    meta: {
      total: totalUsers,
    },
  };
};


const getSingleUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
    }
    return {
        data: user
    }
};


export const userServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
