import express from 'express'
const accountRoute =express.Router()
import {getAccountCodes,createAccountCode,updateAccountCodeById,deleteAccountCodeById} from '../controllers/accountController.js';


accountRoute
.get('/',getAccountCodes)
.post('/', createAccountCode)
.patch('/:id',updateAccountCodeById)
.delete('/:id',deleteAccountCodeById)



export default accountRoute;
