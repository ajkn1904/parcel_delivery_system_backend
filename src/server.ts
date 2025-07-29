/* eslint-disable no-console */
import { Server } from "http";
import { envVars } from "./app/config/env";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const PORT = envVars.PORT;


const startServer = async () => {
  try {
    await mongoose.connect(`${envVars.DATABASE_URL}`);
    console.log("connected to MongoDB using mongoose.");

    server = app.listen(PORT, () => {
      console.log(`Parcel Deliver System Server is listening to port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();





//unhandledRejection error handler
process.on("unhandledRejection", (error) => {
  console.log(
    "Unhandled Rejection Error Detected. Server is Shutting down...",
    error
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

//unhandledException error handler
process.on("uncaughtException", (error) => {
  console.log(
    "Uncaught Exception Error Detected. Server is Shutting down...",
    error
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//SIGTERM signal handler
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Server is shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//SIGINT signal handler
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Server is shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});