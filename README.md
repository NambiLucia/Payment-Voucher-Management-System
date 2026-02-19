# Nova Payment Voucher Management System REST API

Nova Payment Voucher Management System is a secure and efficient backend solution that enables NGOs and SMEs to create, review, and approve payment vouchers from anywhere—no physical presence required. By eliminating paper-based processes, Nova streamlines approvals, saves time, and improves operational efficiency. Built with **Node.js**, **Express**, and **PostgreSQL (Prisma ORM)**, it provides a robust foundation for managing organizational voucher payments digitally.

---
## 🚀 Features

### Authentication & Authorization
- JWT-based authentication for secure login
- Register, Login, Forgot Password, and Reset Password endpoints
- Role-Based Access Control (RBAC) for secure access management

### Payments & Voucher Management
- Create, update, review, approve, and track vouchers
- Retrieve vouchers by user, status, or ID
- Automatic status tracking for full accountability

### Document Management
- Upload and manage multiple payment voucher-related documents via Cloudinary
- Secure and validated file uploads

### Reference Data
- Manage budget codes, account codes, and beneficiary codes
- Full CRUD support for all organizational reference data

---

## 🛠️ Tech Stack

| Layer                 | Technology |
|-----------------------|------------|
| Backend               | Node.js, Express.js |
| Database              | PostgreSQL, Prisma ORM |
| Authentication        | JWT, Bcrypt |
| File Storage          | Cloudinary (via multer) |
| Containerization | Docker |
| Deployment            | Render |


---

## 📌 Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/NambiLucia/Payment-Voucher-Management-System.git
cd Payment-Voucher-Management-System

2️⃣ Install Dependencies
npm install

3️⃣ Run Database Migrations
npx prisma migrate dev --name init

4️⃣ Start the Server
npm run start


Server will run at:

http://localhost:3500/api/v2/


Or use the deployed version: https://paymentvouchermanagementsystem-app-latest.onrender.com/

📌 API Endpoints
Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/users/register` | Register a new user |
| POST | `/users/create-admin` | Create a new admin user |
| POST | `/users/login` | Login a registered user |
| POST | `/users/change-password` | Change password for newly created users |
| POST | `/users/forgot-password` | Send password reset link |
| POST | `/users/reset-password` | Reset password using reset token |
| PATCH | `/users/update-user/:id` | Update user details |
| DELETE | `/users/delete-user/:id` | Delete a user |

### 📄 Vouchers 

Method	Handles Voucher creation, Update, submission, review,approve and reject
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vouchers` | Get all vouchers |
| GET | `/vouchers/by-user/:userId/vouchers` | Get vouchers by User ID |
| GET | `/vouchers/by-id/:id` | Get voucher by Voucher ID |
| GET | `/vouchers/filter/:status` | Filter vouchers by status |
| POST | `/vouchers` | Create a new voucher |
| PATCH | `/vouchers/:id` | Update a voucher by ID |
| PATCH | `/vouchers/:id/submit` | Submit voucher for review |
| PATCH | `/vouchers/:id/review` | Review a voucher |
| PATCH | `/vouchers/:id/send-back` | Send back a voucher for correction |
| PATCH | `/vouchers/:id/approve` | Approve a voucher |
| PATCH | `/vouchers/:id/reject` | Reject a voucher |
| DELETE | `/vouchers/:id/delete` | Soft-delete a voucher |
| PATCH | `/vouchers/:id/restore` | Restore a deleted voucher |




## 📎 Documents

Handles document management for uploaded voucher files.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents` | Get all uploaded payment documents |
| DELETE | `/documents/:id` | Delete a document by ID |

##  Budget Codes
Method	Handles Budget Code Creation, Update and Delete

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budgetcodes` | Get all budget codes |
| POST | `/budgetcodes` | Create a new budget code |
| PATCH | `/budgetcodes/:id` | Update a budget code |
| DELETE | `/budgetcodes/:id` | Delete a budget code |

## 🏷️ Beneficiary Codes
Method	Handles Beneficiary Code Creation, Update and Delete

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/beneficiarycodes` | Get all beneficiary codes |
| POST | `/beneficiarycodes` | Create a new beneficiary code |
| PATCH | `/beneficiarycodes/:id` | Update a beneficiary code |
| DELETE | `/beneficiarycodes/:id` | Delete a beneficiary code |

## 🧾 Account Codes

Method	Handles Account Code Creation, Update and Delete

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accountcodes` | Get all account codes |
| POST | `/accountcodes` | Create a new account code |
| PATCH | `/accountcodes/:id` | Update an account code |
| DELETE | `/accountcodes/:id` | Delete an account code |
📌 Voucher Management

Nova provides a robust workflow for voucher creation, review, and approval, with role-based security.

## Key Features:

- Create Vouchers: Initiators/Admins can create vouchers with multiple supporting documents.

- Update Vouchers: Edit voucher details securely.

- Submit for Review: Initiators submit vouchers for reviewer approval.

- Review Vouchers: Reviewers evaluate submitted vouchers, with options to approve, reject, or send back for corrections.

- Approve / Reject: Approvers finalize voucher workflow.

- Send Back / Correct: Reviewers can return vouchers for edits.

- Delete & Restore: Soft-delete vouchers and restore as needed.

- Filter & Retrieve: Retrieve vouchers by user, status, or ID.

- Automatic Status Tracking: Every action updates voucher status for accountability.

## RBAC Enforcement: Endpoint access is restricted based on role:

- Initiator: Create, update, submit, delete

- Reviewer: Review, send back 

- Approver: Approve or reject

- Admin: Full access, including restore


## Important Notes:

- Supports multiple file attachments with validation

- Soft-delete ensures auditability

- All workflow actions automatically update voucher status

- Role-based access prevents unauthorized operations

## Future Improvements

- Enhanced Dashboard & UX/UI

- Interactive charts, real-time transaction tracking, customizable widgets

- Dark mode and accessibility enhancements

- Granular permissions and audit logs

- Email notifications for approvals, role changes, and alerts

### Notifications System

- Email, in-app, or SMS notifications for critical actions

- Real-time alerts via WebSockets


📜 License

This project is licensed under the MIT License.

---

