import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get("/:threadId",(req,res) =>{
    
    res.json({success:true})
})

app.listen(PORT,() =>{
    console.log("listening on port 3000")
})