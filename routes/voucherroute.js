import express from 'express'
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId,getVoucherByVoucherId,getFilteredVouchers,createVoucher } from '../controllers/voucherController.js';
import { softDeleteFilter } from '../middleware/softDeleteFilter.js';
import { validateToken } from '../middleware/validateToken.js'
import { voucherSchema } from '../middleware/joi-schemas.js';
import { schemaValidator } from '../middleware/schemaValidator.js';


voucherRoute
.get('/',softDeleteFilter,getVouchers)
.get('/by-user/:userId/vouchers',getVouchersByUserId)
.get('/by-id/:id',getVoucherByVoucherId)
.get('/filtered',validateToken,getFilteredVouchers)
.post('/',schemaValidator(voucherSchema),createVoucher)



export default voucherRoute;
