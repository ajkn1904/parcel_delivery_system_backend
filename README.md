# Parcel Delivery System

### **🎯 Project Overview**

This is a **secure, modular, and role-based backend API** for a parcel delivery system (inspired by Pathao Courier or Sundarban) using **Express.js** and **Mongoose**.

The goal is to implement a system where users can register as senders or receivers and perform parcel delivery operations such as **create parcel**, **track status**, and **cancel or receive parcels**.


* * *


## 🔑 Key Features

- 🔐 Authentication
- 🎭 Role-based Authorization (`admin`, `sender`, `receiver`)
- 🛠️ Parcel and Status Management
- 📦 Modular Code Architecture
- ❇️ Transactional Logic
- 🔁 Proper API Endpoints & Proper schema validation
- 🔎 Filtering features
- ♾️ Generic Error Response/Global Error Handler

* * *

## 🛠️ Technology Stack

| Category | Tools |
|---------|-------|
| ⚙️ Runtime | Node.js |
| 🔧 Framework | Express.js |
| 🧠 Language | TypeScript |
| 🛢️ Database | MongoDB + Mongoose |
| 🛡️ Security | jwt, bcrypt |
| 📦 Others | cors, cookie-parser, zod, dotenv, passport, etc, express-session, http-status-code, esLint. |


* * *


## 🧱 Installation & Setup Process
### CLI Commands :----------
- `npm init --y` 
- `npm i -D typescript`
- `tsc --init`
- `npm i express cors  mongoose zod jsonwebtoken dotenv`
- `npm i -D ts-node-dev @types/express @types/cors @types/dotenv @types/jsonwebtoken`
- `npm i -D nodemon`
- `npm i bcryptjs`
- `npm i -D @types/bcryptjs`
- `npm install cookie-parser`
- `npm install -D @types/cookie-parser`
- `npm i passport passport-local passport-google-oauth20`
- `npm i -D @types/passport @types/passport-local @types/passport-google-oauth20`
- `npm i http-status-codes @types/http-status-codes`
- `npm i express-session @types/express-session`
- `npm install --save-dev eslint @eslint/js typescript typescript-eslint`


### At `tsconfig.json` :----------
```json
"rootDir": "./src/",
"outDir": "./dist/"
...
```

### At `package.json` :----------
```json
"scripts": {
  "start": "node ./dist/server.js",    
  "start:prod": "nodemon ./dist/server.js", 
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "lint": "npx eslint ./src",
  "...": "..."
}
```

### At `exlint.config.mjs` :----------
for es lint set up
```js
export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        rules: {
            'no-console': 'warn',
        }
    }
);
```


* * *

## 🧩 API Details
### APIs related to User :----------
 1. **POST** `/api/user/register` --- api for creating user
 2. **GET** `/api/user/` --- api for getting all users
 3. **GET** `/api/user/receivers` --- api for getting all receivers
 4. **GET** `/api/user/me` --- api for getting all users own info
 5. **GET** `/api/user/:id` --- api for getting single user data
 6. **PATCH** `/api/user/:id` --- api for updating user
 7. **DELETE** `/api/user/me` --- api for deleting own account by user


### APIs related to Auth :----------
 1. **POST** `/api/auth/login` --- api for user login
 2. **POST** `/api/auth/logout` --- api for user logout
 3. **POST** `/api/auth/refresh-token` --- api for getting refresh token
 4. **POST** `/api/auth/reset-password` --- api for resetting password
 5. **GET** `/api/auth/google` --- api for google login
 5. **GET** `/api/auth/google/callback` --- api for redirecting to frontend


### APIs related to Parcel :----------
 1. **POST** `/api/parcel/create` --- api for creating parcel
 2. **GET** `/api/parcel/` --- api for getting all parcels
 3. **GET** `/api/parcel/:id` --- api for getting single parcel data
 4. **GET** `/api/parcel/history/:id` --- api for tracking parcel log/status
 5. **PATCH** `/api/parcel/status/:id` --- api for updating parcel status to `Canceled`(`Sender`) or `Delivered`(`receiver`).
 6. **PATCH** `/api/parcel/admin/status/:id` --- api for updating parcel status by `admin` to `Approved`/`Dispatched`/`In Transit` etc.
 7. **DELETE** `/api/parcel/:id` --- api for deleting parcel


 ### APIs related to Coupon :----------
 1. **POST** `/api/coupon/create` --- api for creating coupon
 2. **GET** `/api/coupon/` --- api for getting all coupons
 3. **GET** `/api/coupon/:id` --- api for getting single coupon data
 4. **PATCH** `/api/coupon/:id` --- api for updating coupon
 5. **DELETE** `/api/coupon/:id` --- api for deleting own account by coupon


 ### APIs related to Analytic :----------
 1. **GET** `/api/analytics//status-distribution` --- api for getting delivery distribution status
 2. **GET** `/api/analytics/monthly-shipments` --- api for getting monthly shipment logs.
 3. **GET** `/api/analytics/trends` --- api for getting last 3 months shipment logs.
 4. **GET** `/api/analytics/overview` --- api for getting overview of (Total parcels, Delivered, In Transit, Pending/Cancelled).
 5. **GET** `/api/analytics/receiver/success-metrics` --- api for getting data of successfully received/canceled/returned shipment.
 6. **GET** `/api/analytics/receiver/delivery-performance` --- api for getting the data for 'On Time' or 'Late' delivery behavior.




