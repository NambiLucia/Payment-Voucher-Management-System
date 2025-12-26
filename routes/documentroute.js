import express from 'express'
const DocumentRoute =express.Router()
import {deleteDocumentById, getDocument} from '../controllers/documentController.js';
import { softDeleteFilter } from '../middleware/softDeleteFilter.js'
import { validateToken } from '../middleware/validateToken.js';


DocumentRoute
.get('/',softDeleteFilter,getDocument)
.delete('/:id',validateToken,deleteDocumentById)



export default DocumentRoute;