import express from 'express'
const accountRoute =express.Router()
import { schemaValidator } from '../middleware/schemaValidator.js';
import { codeSchema,updateCodeSchema } from '../middleware/joi-schemas.js';
import {getAccountCodes,createAccountCode,updateAccountCodeById,deleteAccountCodeById} from '../controllers/accountController.js';


accountRoute
.get('/',getAccountCodes)
.post('/', schemaValidator(codeSchema),createAccountCode)
.patch('/:id',schemaValidator(updateCodeSchema),updateAccountCodeById)
.delete('/:id',deleteAccountCodeById)



export default accountRoute;
