import express from 'express'
const voucherRoute =express.Router()
import { getVouchers } from '../controllers/voucherController.js';


voucherRoute
.get('/',getVouchers)


export default voucherRoute;
