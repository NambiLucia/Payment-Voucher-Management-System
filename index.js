import express from 'express'
import fs from'fs'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'



//routes



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







app.get('/', (req,res)=>{
    return res.send('<h1>🚀 Nova API is running!</h1>')

})

export default app;