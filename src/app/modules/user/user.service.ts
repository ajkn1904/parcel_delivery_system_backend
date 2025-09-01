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
    if (isUserExists.isDeleted) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Email is taken, try another email.");
    }
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


  if ((payload.isDeleted || payload.isBlocked) && ifUserExists.role === Role.admin) {
   throw new AppError(StatusCodes.FORBIDDEN, "Admin users cannot be deleted or blocked.");
  }


  if (payload.email) {
    throw new AppError(StatusCodes.FORBIDDEN, "Email cannot be changed");
  };

  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
  };

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true});

  return newUpdatedUser;

};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllUsers = async (query: Record<string, any>) => {

  const users = await User.find(query);
  const totalUsers = await User.countDocuments(query);

  return {
    users,
    meta: {
      total: totalUsers,
    },
  };
};


const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
    }
    return {
        data: user
    }
};


const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
      data: user
  }
}


const deleteOwnAccount = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: { $ne: true } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found or already deleted");
  }

  if (user.role !== Role.sender && user.role !== Role.receiver) {
    throw new AppError(StatusCodes.FORBIDDEN, "Only sender or receiver can delete account");
  }

  user.isDeleted = true;
  await user.save();

  return { message: "Account deleted successfully" };
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllReceivers = async (decodedToken: JwtPayload, query: Record<string, any> = {}) => {
  
  if (decodedToken.role !== Role.sender) {
    throw new AppError(StatusCodes.FORBIDDEN, "Only sender can fetch receivers");
  }

  const receiversQuery = { ...query, role: Role.receiver, isDeleted: { $ne: true } };

  const users = await User.find(receiversQuery).select("_id email");

  const totalReceivers = await User.countDocuments(receiversQuery);

  return {
    users,
    meta: {
      total: totalReceivers,
    },
  };
};


export const userServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteOwnAccount,
  getMe,
  getAllReceivers
};
