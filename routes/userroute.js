import express from 'express'
const userRoute =express.Router()
import {getUsers,login,register,updateUserById,deleteUserById} from '../controllers/userController.js'
import { softDeleteFilter } from '../middleware/softDeleteFilter'
import { validateToken } from '../middleware/validateToken'


userRoute
.get('/',softDeleteFilter,getUsers)
.post('/register',register)
.post('/login',login)
.patch('/updateUser/:id',updateUserById)
.delete('/deleteUser/:id',validateToken,deleteUserById)


export default userRoute;
