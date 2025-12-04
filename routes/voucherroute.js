import express from 'express'
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId,getVoucherByVoucherId,getFilteredVouchers } from '../controllers/voucherController.js';
import { softDeleteFilter } from '../middleware/softDeleteFilter.js';


voucherRoute
.get('/',softDeleteFilter,getVouchers)
.get('/by-user/:userId/vouchers',getVouchersByUserId)
.get('/by-id/:id',getVoucherByVoucherId)
.get('/search-status/:status',getFilteredVouchers)


export default voucherRoute;
