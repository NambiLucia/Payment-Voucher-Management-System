import express from 'express'
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId,getVoucherByVoucherId,getFilteredVouchers } from '../controllers/voucherController.js';
import { softDeleteFilter } from '../middleware/softDeleteFilter.js';
import { validateToken } from '../middleware/validateToken'


voucherRoute
.get('/',softDeleteFilter,getVouchers)
.get('/by-user/:userId/vouchers',getVouchersByUserId)
.get('/by-id/:id',getVoucherByVoucherId)
.get('/filtered',validateToken,getFilteredVouchers)



export default voucherRoute;
