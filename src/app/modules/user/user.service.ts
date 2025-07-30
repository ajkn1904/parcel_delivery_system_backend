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


  if(payload.role){
    if(payload.role === Role.admin && (decodedToken.role === Role.sender || decodedToken.role === Role.receiver)){
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized!");
    }
    if((payload.role === Role.sender || payload.role === Role.receiver) && decodedToken.role === Role.admin){
      throw new AppError(StatusCodes.FORBIDDEN, `Admin cannot modify the account to ${payload.role}!`);
    }
  };

  if(payload.isBlocked || payload.isDeleted){
    if(decodedToken.role === Role.receiver || decodedToken.role ===  Role.sender){
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized!");
    }
  };

  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
  };

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true});

  return newUpdatedUser;

};



const getAllUsers = async () => {

    const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    users,
    meta: {
      total: totalUsers,
    },
  };
};


const getSingleUser = async (id: string) => {
    const user = await User.findById(id);
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
