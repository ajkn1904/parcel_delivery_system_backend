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

}

const loadEnvVars = (): EnvConfig => {
  const requiredEnvVars: string[] = ["PORT", "DATABASE_URL", "NODE_ENVIRONMENT","JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES","JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES",];


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

    };
};

export const envVars = loadEnvVars();