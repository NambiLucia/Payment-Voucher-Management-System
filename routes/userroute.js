import express from 'express'
const userRoute =express.Router()

import {getUsers,register} from '../controllers/userController.js'
userRoute
.get('/',getUsers)
.post('/register',register)
.post('/login',register)



export default userRoute;
