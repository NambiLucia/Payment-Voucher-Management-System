import express from 'express'
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId,getVoucherByVoucherId,getFilteredVouchers,createVoucher,updateVoucher,submitVoucher,reviewVoucher } from '../controllers/voucherController.js';
import { softDeleteFilter } from '../middleware/softDeleteFilter.js';
import { validateToken } from '../middleware/validateToken.js'
import { schemaValidator } from '../middleware/schemaValidator.js';
import { voucherSchema } from '../middleware/joi-schemas.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';
import { normalizeDateFormat } from '../middleware/dateNormalizer.js';
import { authorizeRole } from '../middleware/authorizeRole.js';



const uploadVoucherDocs = uploadMiddleware("voucher-documents");

voucherRoute
.get('/',softDeleteFilter,getVouchers)
.get('/by-user/:userId/vouchers',getVouchersByUserId)
.get('/by-id/:id',getVoucherByVoucherId)
.get('/filtered',validateToken,getFilteredVouchers)
.post('/',validateToken,uploadVoucherDocs.array("document", 10),normalizeDateFormat,
schemaValidator(voucherSchema),createVoucher)
.patch("/:id",validateToken,authorizeRole('INITIATOR'),updateVoucher)
.patch("/vouchers/:id/submit", validateToken,authorizeRole('INITIATOR'),submitVoucher)
.patch("/vouchers/:id/review",validateToken,authorizeRole('REVIEWER'), reviewVoucher)


export default voucherRoute;
