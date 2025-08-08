import express from 'express'

const app =express();

//middle ware
app.use(express.json());






app.get('/', (req,res)=>{
    return res.send('<h1>🚀 Nova API is running!</h1>')

})

export default app;