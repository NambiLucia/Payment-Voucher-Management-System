import dotenv from 'dotenv'
dotenv.config();
import app from "./index.js";


const PORT = process.env.PORT || 3500

app.listen(PORT,() =>{
    console.log(`Server listening on http://localhost:${PORT}`)
})