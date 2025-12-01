import express from 'express'
const BeneficiaryRoute =express.Router()
import { schemaValidator } from '../middleware/schemaValidator.js';
import { codeSchema,updateCodeSchema } from '../middleware/joi-schemas.js';
import {getBeneficiaryCodes,createBeneficiaryCode,updateBeneficiaryCodeById,deleteBeneficiaryCodeById} from '../controllers/beneficiaryController.js';


BeneficiaryRoute
.get('/',getBeneficiaryCodes)
.post('/', schemaValidator(codeSchema),createBeneficiaryCode)
.patch('/:id',schemaValidator(updateCodeSchema),updateBeneficiaryCodeById)
.delete('/:id',deleteBeneficiaryCodeById)



export default BeneficiaryRoute;