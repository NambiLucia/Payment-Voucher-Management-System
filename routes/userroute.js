import express from 'express'
const userRoute =express.Router()

import {getUsers,login,register,updateUserById,deleteUserById} from '../controllers/userController.js'
userRoute
.get('/',getUsers)
.post('/register',register)
.post('/login',login)
.patch('/updateUser/:id',updateUserById)
.delete('/deleteUser/:id',deleteUserById)


export default userRoute;
