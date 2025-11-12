Here's an improved version of your **README** instructions with better clarity and formatting:  

---

# **Project Setup Guide**  

## **Getting Started**  

Follow these steps to set up the project on your local machine.  

### **1. Clone the Repository**  
Since this is a **private repository**, make sure you have been added as a collaborator. Then, run:  
```sh
git clone <repository-url>
cd <project-folder>
```

### **2. Initialize the Project**  
Run the following command to create a `package.json` file (if not already present):  
```sh
npm init -y
```

### **3. Install Dependencies**  
Install the required dependencies in the project root:  
```sh
npm install express body-parser cors dotenv mongoose express-async-handler
```

### **4. Create a `.env` File**  
In the root directory of the project, create a file named `.env` and add the following variables:  
```
PORT=<your-port-number>
CONNECTION_STRING=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
```

### **5. Start the Server**  
Run the server using:  
```sh
node server.js
```
or, if using **nodemon** (recommended for development):  
```sh
npx nodemon server.js
```

### **6. Access the Application**  
Once the server is running, open your browser and visit:  
```
http://localhost:<PORT>
```

### **Additional Notes**  
- If you face any issues, ensure **MongoDB is running** and the connection string in `.env` is correct.  
- To collaborate, you need access to this **private repository**. Contact the owner for access if needed.  

---



```
backend/
│── config/
│   ├── db.js                 # Database connection setup
│   ├──          
│── controllers/
│  
│── middleware/
│
│── models/
│   

│── routes/


│── utils/
│   ├── generateToken.js       # JWT Token generation utility
│── .env                       # Environment variables (e.g., database URL, JWT secret)
│── server.js                  # Main entry point of the backend
│── package.json               # Project dependencies
│── README.md                   # Project documentation

```


config/
db.js

controller/
authController.js
customerController.js
userController.js
vendorController.js

middleware/
authMiddleware.js

modles/

customerModels.js
userModel.js
vendorModel.js

node_modules/

routes/
authRoutes.js
customerAuthRoutes.js
userRoutes.js
vendorAuthRoutes.js

utils/
generateToken.js

.env

.gitjgnore

package-lock.json
package-lock.json
README.md

server.js


final file Struct :


config/
  └── db.js

controllers/
  ├── authController.js
  ├── customerController.js
  ├── userController.js
  ├── vendorController.js
  ├── vehicleController.js              ✅
  ├── registrationController.js         ✅
  ├── bookingController.js              ✅
  ├── paymentController.js              ✅
  ├── feedbackController.js             ✅

middleware/
  └── authMiddleware.js

models/
  ├── customerModels.js
  ├── userModel.js
  ├── vendorModel.js
  ├── vehicleModel.js                   ✅
  ├── vehicleRegistrationModel.js       ✅
  ├── bookingModel.js                   ✅
  ├── paymentModel.js                   ✅
  ├── feedbackModel.js                  ✅

routes/
  ├── authRoutes.js
  ├── customerAuthRoutes.js
  ├── userRoutes.js
  ├── vendorAuthRoutes.js
  ├── vehicleRoutes.js                  ✅
  ├── registrationRoutes.js             ✅
  ├── bookingRoutes.js                  ✅
  ├── paymentRoutes.js                  ✅
  ├── feedbackRoutes.js                 ✅

utils/
  └── generateToken.js

.env
.gitignore
package.json
package-lock.json
README.md
server.js




Absolutely! Here's a clean and helpful `README` summary you can include in your project, especially for future reference or team members working on the **"Add Vehicle"** feature:

---

## 🛠️ Add Vehicle Feature — Summary & Troubleshooting Guide

### 🧩 **Feature Overview**

The goal was to allow **vendors** to upload vehicle details along with an optional image. This involved:

- Authenticating the vendor via JWT
- Uploading images using `multer`
- Saving vehicle data in MongoDB using Mongoose

---

### ✅ **Steps Taken**

1. **Created `vehicleModel.js`** with fields like `vehicleId`, `vehicleType`, `registrationId`, `dailyPrice`, `vendorId`, and `image`.

2. **Configured routes in `vehicleRoutes.js`**:
   ```js
   router.post("/add", authMiddleware, upload.single("image"), addVehicle);
   ```

3. **Wrote the `addVehicle` controller** in `vehicleController.js`:
   - Checked if the vendor is authenticated
   - Used the uploaded file's path
   - Saved the vehicle with `vendorId` from the token

4. **Protected routes with `authMiddleware.js`** using JWT

5. **Vendor logs in**, receives a token, and uses it as `Bearer <token>` in Postman or frontend headers

---

### 😓 Problem Faced

After setting everything up, **the server was still throwing a `500` or `400` error** with this message:

```json
"Vehicle validation failed: vendorId: Path `vendorId` is required."
```

Even though the image uploaded successfully and all body fields were passed correctly, **Mongoose validation failed** because `vendorId` was missing.

---

### 💣 Root Cause

🔍 **In `authMiddleware.js`**, the `req.user` was set to the decoded JWT payload.

🔍 **In the JWT**, we were passing:
```js
{ vendorId: vendor._id, email: vendor.email }
```

🔍 **But in the controller**, we tried accessing:
```js
req.user._id
```

So `vendorId` was actually `undefined`, and MongoDB refused to save the document.

---

### 🛠️ Solution

💡 In the **login controller**, update the JWT token like this:

```js
// Correct JWT payload
const token = jwt.sign(
  { _id: vendor._id, email: vendor.email },
  process.env.JWT_SECRET,
  { expiresIn: "30d" }
);
```

This way, the `req.user._id` will be available as expected in `addVehicle`.

---

### ✅ Final Result

Once fixed, the API returns:

```json
{
  "vehicleId": "V1234",
  "vehicleType": "Sedan",
  "registrationId": "AB123",
  "vendorId": "60b1d...",
  "image": "/uploads/1745008759488.png",
  "dailyPrice": 50,
  "_id": "123...",
  "createdAt": "2025-04-18T...",
  ...
}
```

🎉 **Success! Vehicle is added and image is uploaded.**

---

### 🧪 Testing Notes

✅ Use `multipart/form-data` in Postman or frontend form  
✅ Ensure `Bearer <token>` is added in headers  
✅ File field name should be `"image"`  
✅ Backend uses `upload.single("image")`

---

### 🧯 Troubleshooting

| Problem | Solution |
|--------|----------|
| `vendorId is required` | Ensure JWT payload contains `_id`, not `vendorId` |
| `Cannot POST /api/vehicles` | Check route is `POST /api/vehicles/add` |
| `401 Not authorized` | Check that `Authorization: Bearer <token>` is passed |
| Image not saved | Confirm `multer` is set up and folder `uploads/` exists |
| Token changes every login | That’s expected; store the latest token on frontend |

---

Let me know if you want this in a `.md` file or added to a project folder!






Libary Management Backend Folder Structure:

config/
  └── db.js

controllers/
  ├── authController.js
  ├── userController.js
  ├── bookController.js
  ├── loanController.js
  ├── feedbackController.js

middleware/
  └── authMiddleware.js

models/
  ├── userModel.js
  ├── bookModel.js
  ├── loanModel.js
  ├── feedbackModel.js

routes/
  ├── authRoutes.js
  ├── userRoutes.js
  ├── bookRoutes.js
  ├── loanRoutes.js
  ├── feedbackRoutes.js

utils/
  └── generateToken.js

.env
.gitignore
package.json
server.js









 — here’s a **full MongoDB schema overview** for your Library Management System backend. This shows all collections, their fields, and relationships so you can visualize and test the system properly.

---

## 1️⃣ Users (`users` collection)

| Field           | Type       | Notes                                            |
| --------------- | ---------- | ------------------------------------------------ |
| `_id`           | ObjectId   | Auto-generated                                   |
| `firebaseId`    | String     | Optional                                         |
| `fullname`      | String     | Required                                         |
| `email`         | String     | Required, unique                                 |
| `password`      | String     | Required (hashed)                                |
| `role`          | String     | Enum: ["customer", "admin"], default: "customer" |
| `profilePic`    | String     | Optional                                         |
| `contacts`      | [ObjectId] | References other `User`s                         |
| `borrowedBooks` | [ObjectId] | References `Book` collection                     |
| `createdAt`     | Date       | Auto                                             |
| `updatedAt`     | Date       | Auto                                             |

---

## 2️⃣ Books (`books` collection)

| Field             | Type     | Notes                             |
| ----------------- | -------- | --------------------------------- |
| `_id`             | ObjectId | Auto                              |
| `title`           | String   | Required                          |
| `author`          | String   | Required                          |
| `genre`           | String   | Optional                          |
| `isbn`            | String   | Required, unique                  |
| `publishedYear`   | Number   | Optional                          |
| `totalCopies`     | Number   | Required                          |
| `availableCopies` | Number   | Tracks currently available copies |
| `createdAt`       | Date     | Auto                              |
| `updatedAt`       | Date     | Auto                              |

---

## 3️⃣ Loans (`loans` collection)

| Field       | Type     | Notes                                                                      |
| ----------- | -------- | -------------------------------------------------------------------------- |
| `_id`       | ObjectId | Auto                                                                       |
| `loanId`    | String   | Unique                                                                     |
| `bookId`    | ObjectId | References `Book`                                                          |
| `userId`    | ObjectId | References `User`                                                          |
| `startDate` | Date     | Required                                                                   |
| `endDate`   | Date     | Required                                                                   |
| `status`    | String   | Enum: ["pending", "accepted", "rejected", "completed"], default: "pending" |
| `createdAt` | Date     | Auto                                                                       |
| `updatedAt` | Date     | Auto                                                                       |

---

## 4️⃣ Feedback (`feedback` collection)

| Field       | Type     | Notes                   |
| ----------- | -------- | ----------------------- |
| `_id`       | ObjectId | Auto                    |
| `user`      | ObjectId | References `User`       |
| `book`      | ObjectId | References `Book`       |
| `rating`    | Number   | Required, 1–5           |
| `comment`   | String   | Optional, max 500 chars |
| `createdAt` | Date     | Auto                    |
| `updatedAt` | Date     | Auto                    |

**Unique index**: `{ user: 1, book: 1 }` → prevents a user from leaving multiple feedbacks for the same book.

---

## 5️⃣ Payments (`payments` collection)

| Field           | Type     | Notes                                                        |
| --------------- | -------- | ------------------------------------------------------------ |
| `_id`           | ObjectId | Auto                                                         |
| `userId`        | ObjectId | References `User`                                            |
| `amount`        | Number   | Required                                                     |
| `paymentMethod` | String   | Enum: ["card", "paypal", "cash", "other"], default: "card"   |
| `status`        | String   | Enum: ["pending", "completed", "failed"], default: "pending" |
| `description`   | String   | Optional                                                     |
| `transactionId` | String   | Unique, required                                             |
| `createdAt`     | Date     | Auto                                                         |
| `updatedAt`     | Date     | Auto                                                         |

---

### 🔗 Relationships Overview

* **Users ↔ Books**: via `borrowedBooks` in `User` and `loans` collection
* **Users ↔ Loans**: one-to-many (`userId`)
* **Books ↔ Loans**: one-to-many (`bookId`)
* **Users ↔ Feedback**: one-to-many (`user`)
* **Books ↔ Feedback**: one-to-many (`book`)
* **Users ↔ Payments**: one-to-many (`userId`)

---

This schema fully supports your **frontend app**:

* You can fetch books, loans, feedbacks, and payments.
* Users can borrow/return books and leave feedback.
* Admins can manage books, loans, feedbacks, and payments.

---


