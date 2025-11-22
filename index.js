import express from 'express'
import fs from'fs'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'

import userRoute from './routes/userroute.js';
import voucherRoute from './routes/voucherroute.js';
import accountRoute from './routes/accountroute.js';








const app =express();

// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs','request_logs.txt'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

//middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())



//middleware for endpoints
app.use('/api/v2/users',userRoute)
app.use('/api/v2/vouchers',voucherRoute)
app.use('/api/v2/accounts',accountRoute)







app.get('/', (req,res)=>{
    return res.send('<h1>🚀 Nova API is running!</h1>')

})

export default app;