import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router(); 

router.post("/create", checkAuth(Role.sender), ParcelController.createParcel);

router.get("/", checkAuth(...Object.values(Role)), ParcelController.getAllParcels);


router.get("/:id", checkAuth(...Object.values(Role)), ParcelController.getSingleParcel);


router.get("/history/:id", checkAuth(...Object.values(Role)), ParcelController.trackParcel);

router.patch("/status/:id", checkAuth(Role.sender, Role.receiver), ParcelController.updateParcelStatus);

router.patch("/admin/status/:id", checkAuth(Role.admin), ParcelController.updateParcelStatusByAdmin);

router.delete("/:id", checkAuth(Role.admin), ParcelController.deleteParcel);

export const ParcelRoutes = router;