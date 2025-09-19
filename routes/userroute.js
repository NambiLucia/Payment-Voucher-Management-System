import express from 'express'
const userRoute =express.Router()
import {getUsers,login,register,updateUserById,deleteUserById} from '../controllers/userController.js'
import { softDeleteFilter } from '../middleware/softDeleteFilter'


userRoute
.get('/',getUsers)
.post('/register',register)
.post('/login',login)
.patch('/updateUser/:id',updateUserById)
.delete('/deleteUser/:id',softDeleteFilter,deleteUserById)


export default userRoute;
