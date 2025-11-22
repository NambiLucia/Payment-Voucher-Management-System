import express from 'express'
const accountRoute =express.Router()
import {getAccountCodes,createAccountCode} from '../controllers/accountController.js';


accountRoute
.get('/',getAccountCodes)
.post('/', createAccountCode)



export default accountRoute;
