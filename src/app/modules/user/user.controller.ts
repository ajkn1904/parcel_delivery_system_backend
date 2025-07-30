import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userServices.createUser(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "User created successfully",
        data: user,
    })

});



const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;

    const verifiedToken = req.user;
    const payload = req.body;


    const user = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload);


    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User updated successfully",
        data: user,
    })

});



const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.getAllUsers();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All users retrieved successfully",
        data: result.users,
        meta: result.meta,
    })

})


const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await userServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})



export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
