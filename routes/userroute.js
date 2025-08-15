import express from 'express'
const userRoute =express.Router()

import {getUsers} from '../controllers/userController.js'
userRoute
.get('/',getUsers)



export default userRoute;
