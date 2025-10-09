import express from 'express'
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId } from '../controllers/voucherController.js';


voucherRoute
.get('/',getVouchers)
.get('/user-vouchers/:id',getVouchersByUserId)


export default voucherRoute;
