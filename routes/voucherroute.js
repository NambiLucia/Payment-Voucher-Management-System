import express from 'express'
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId,getFilteredVouchers } from '../controllers/voucherController.js';
import { softDeleteFilter } from '../middleware/softDeleteFilter.js';


voucherRoute
.get('/',softDeleteFilter,getVouchers)
.get('/user-vouchers/:id',getVouchersByUserId)
.get('/search-status/:status',getFilteredVouchers)


export default voucherRoute;
