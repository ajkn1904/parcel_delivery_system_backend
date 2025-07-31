import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  NODE_ENVIRONMENT: "development" | "production";
  JWT_ACCESS_SECRET: string, 
  JWT_ACCESS_EXPIRES: string,
  JWT_REFRESH_SECRET: string,
  JWT_REFRESH_EXPIRES: string,
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CALLBACK_URL: string
  BCRYPT_SALT_ROUND: string,
  FRONTEND_URL: string,
  ADMIN_EMAIL: string,
  ADMIN_PASSWORD: string,

}

const loadEnvVars = (): EnvConfig => {
  const requiredEnvVars: string[] = ["PORT", "DATABASE_URL", "NODE_ENVIRONMENT","JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES","JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES","GOOGLE_CLIENT_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CALLBACK_URL", "BCRYPT_SALT_ROUND", "FRONTEND_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD"];


requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is missing`);
    }
  });
  

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    NODE_ENVIRONMENT: process.env.NODE_ENVIRONMENT as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string, 
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string, 
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string, 
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string, 
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string, 
    
    };
};

export const envVars = loadEnvVars();