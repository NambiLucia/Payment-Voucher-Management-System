import express from 'express'
import { Role } from "@prisma/client";
const userRoute =express.Router()
import {getUsers,login,register,createSuperAdmin,changePassword,forgotPassword,resetPassword,updateUserById,deleteUserById} from '../controllers/userController.js'
import { softDeleteFilter } from '../middleware/softDeleteFilter.js'
import { validateToken } from '../middleware/validateToken.js'
import { authorizeRole } from '../middleware/authorizeRole.js';
import { schemaValidator } from '../middleware/schemaValidator.js'
import { userSchema } from '../middleware/joi-schemas.js'
import { superAdminSchema } from '../middleware/joi-schemas.js';


userRoute
.get('/',softDeleteFilter,getUsers)
.post('/register',validateToken,authorizeRole([Role.ADMIN]),schemaValidator(userSchema),register)
.post('/create-admin',schemaValidator(superAdminSchema),createSuperAdmin)
.post('/login',login)
.post('/change-password',validateToken,changePassword)
.post('/forgot-password',forgotPassword)
.post('/reset-password',resetPassword)
.patch('/updateUser/:id',schemaValidator(userSchema),updateUserById)
.delete('/deleteUser/:id',validateToken,deleteUserById)


export default userRoute;
