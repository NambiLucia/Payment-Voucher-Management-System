import express from 'express'
const BudgetRoute =express.Router()
import { schemaValidator } from '../middleware/schemaValidator.js';
import { codeSchema,updateCodeSchema } from '../middleware/joi-schemas.js';
import {getBudgetCodes,createBudgetCode,updateBudgetCodeById,deleteBudgetCodeById} from '../controllers/budgetController.js';


BudgetRoute
.get('/',getBudgetCodes)
.post('/', schemaValidator(codeSchema),createBudgetCode)
.patch('/:id',schemaValidator(updateCodeSchema),updateBudgetCodeById)
.delete('/:id',deleteBudgetCodeById)



export default BudgetRoute;