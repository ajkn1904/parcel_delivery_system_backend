import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  NODE_ENVIRONMENT: "development" | "production";

}

const loadEnvVars = (): EnvConfig => {
  const requiredEnvVars: string[] = ["PORT", "DATABASE_URL", "NODE_ENVIRONMENT",];


requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is missing`);
    }
  });
  

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    NODE_ENVIRONMENT: process.env.NODE_ENVIRONMENT as "development" | "production",

    };
};

export const envVars = loadEnvVars();