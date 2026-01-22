import express from 'express'
import { Role } from "@prisma/client";
const voucherRoute =express.Router()
import { getVouchers,getVouchersByUserId,getVoucherByVoucherId,getFilteredVouchers,createVoucher,updateVoucher,submitVoucher,reviewVoucher,sendBackVoucher,approveVoucher,rejectVoucher,deleteVoucherById,restoreVoucherById } from '../controllers/voucherController.js';
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
.get('/filter/:status',validateToken,getFilteredVouchers)
.post('/',validateToken,uploadVoucherDocs.array("document", 10),normalizeDateFormat,
schemaValidator(voucherSchema),createVoucher)
.patch("/:id",validateToken,authorizeRole([Role.INITIATOR,Role.ADMIN]),updateVoucher)
.patch("/:id/submit", validateToken,authorizeRole([Role.INITIATOR,Role.ADMIN]),submitVoucher)
.patch("/:id/review",validateToken,authorizeRole([Role.REVIEWER,Role.ADMIN]), reviewVoucher)
.patch("/:id/send-back", validateToken,authorizeRole([Role.REVIEWER,Role.ADMIN]),schemaValidator(sendBackSchema),sendBackVoucher)
.patch("/:id/approve", validateToken, 
    authorizeRole([Role.APPROVER,Role.ADMIN]), 
    approveVoucher)
    .patch("/:id/reject",validateToken,authorizeRole([Role.APPROVER,Role.ADMIN]),schemaValidator(rejectVoucherSchema), rejectVoucher)
.delete("/:id/delete",validateToken,authorizeRole([Role.INITIATOR,Role.ADMIN]),deleteVoucherById)
.patch("/:id/restore",validateToken,authorizeRole([Role.ADMIN]),restoreVoucherById)




export default voucherRoute;
