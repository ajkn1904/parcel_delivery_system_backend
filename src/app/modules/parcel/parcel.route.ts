import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router(); 

router.post("/create", checkAuth(Role.sender), ParcelController.createParcel);

export const ParcelRoutes = router;