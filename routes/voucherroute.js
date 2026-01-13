import express from 'express'
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId,getVoucherByVoucherId,getFilteredVouchers,createVoucher,updateVoucher,submitVoucher,reviewVoucher,sendBackVoucher,approveVoucher,rejectVoucher } from '../controllers/voucherController.js';
import { softDeleteFilter } from '../middleware/softDeleteFilter.js';
import { validateToken } from '../middleware/validateToken.js'
import { schemaValidator } from '../middleware/schemaValidator.js';
import { voucherSchema } from '../middleware/joi-schemas.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';
import { normalizeDateFormat } from '../middleware/dateNormalizer.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { sendBackSchema } from '../middleware/joi-schemas.js';
import { rejectVoucherSchema } from '../middleware/joi-schemas.js';





const uploadVoucherDocs = uploadMiddleware("voucher-documents");

voucherRoute
.get('/',softDeleteFilter,getVouchers)
.get('/by-user/:userId/vouchers',getVouchersByUserId)
.get('/by-id/:id',getVoucherByVoucherId)
.get('/filtered',validateToken,getFilteredVouchers)
.post('/',validateToken,uploadVoucherDocs.array("document", 10),normalizeDateFormat,
schemaValidator(voucherSchema),createVoucher)
.patch("/:id",validateToken,authorizeRole('INITIATOR','ADMIN'),updateVoucher)
.patch("/vouchers/:id/submit", validateToken,authorizeRole('INITIATOR','ADMIN'),submitVoucher)
.patch("/vouchers/:id/review",validateToken,authorizeRole('REVIEWER','ADMIN'), reviewVoucher)
.patch("/vouchers/:id/send-back", validateToken,authorizeRole('REVIEWER','ADMIN'),schemaValidator(sendBackSchema),sendBackVoucher)
.patch("/vouchers/:id/approve", validateToken, 
    authorizeRole('APPROVER','ADMIN'), 
    approveVoucher)
    .patch("/vouchers/:id/reject",validateToken,authorizeRole('APPROVER','ADMIN'),schemaValidator(rejectVoucherSchema), rejectVoucher)


export default voucherRoute;
