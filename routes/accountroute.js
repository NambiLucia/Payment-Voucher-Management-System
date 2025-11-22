import express from 'express'
const accountRoute =express.Router()
import {getAccountCodes} from '../controllers/accountController.js';


accountRoute
.get('/',getAccountCodes)



export default accountRoute;
