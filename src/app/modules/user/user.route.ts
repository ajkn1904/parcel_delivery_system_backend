import { Router } from "express";
import { validationRequest } from "../../middlewares/validationRequest";
import { createZodSchema, updateZodSchema } from "./user.validation";
import { userController } from "./user.controller";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/register", validationRequest(createZodSchema), userController.createUser);

router.get("/", checkAuth(Role.admin) ,userController.getAllUsers);
router.get("/me", checkAuth(...Object.values(Role)), userController.getMe)

router.get("/:id", checkAuth(...Object.values(Role)), userController.getSingleUser)


router.patch("/:id", validationRequest(updateZodSchema), checkAuth(...Object.values(Role)) ,userController.updateUser);

router.delete("/me", checkAuth(Role.sender, Role.receiver), userController.deleteOwnAccount)

export const UserRoutes = router;