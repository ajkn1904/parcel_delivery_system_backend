import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({email: envVars.ADMIN_EMAIL});

    if (isAdminExist) {
      return;
    }

    const hashedPassword = await bcryptjs.hash(envVars.ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

    const authsProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "PDS Admin",
      role: Role.admin,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      auths: [authsProvider],
    };

    const Admin = await User.create(payload);

    console.log("Admin Created Successfully! \n");
    console.log(Admin);
  } 
  catch (error) {
    console.log(error);
  }
};
