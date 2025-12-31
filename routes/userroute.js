import express from 'express'
const userRoute =express.Router()
import {getUsers,login,register,updateUserById,deleteUserById} from '../controllers/userController.js'
import { softDeleteFilter } from '../middleware/softDeleteFilter.js'
import { validateToken } from '../middleware/validateToken.js'
import { schemaValidator } from '../middleware/schemaValidator.js'
import { userSchema } from '../middleware/joi-schemas.js'


userRoute
.get('/',softDeleteFilter,getUsers)
.post('/register',schemaValidator(userSchema),register)
.post('/login',login)
.patch('/updateUser/:id',schemaValidator(userSchema),updateUserById)
.delete('/deleteUser/:id',validateToken,deleteUserById)


export default userRoute;
