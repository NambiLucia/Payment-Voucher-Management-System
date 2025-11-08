import express from 'express'
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId,getFilteredVouchers } from '../controllers/voucherController.js';


voucherRoute
.get('/',getVouchers)
.get('/user-vouchers/:id',getVouchersByUserId)
.get('/search-status/:status',getFilteredVouchers)


export default voucherRoute;
