import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router(); 

router.post("/create", checkAuth(Role.sender), ParcelController.createParcel);

router.get("/", checkAuth(...Object.values(Role)), ParcelController.getAllParcels);


router.get("/:id", checkAuth(...Object.values(Role)), ParcelController.getSingleParcel);

export const ParcelRoutes = router;