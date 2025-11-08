import express, { type Request, type Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import getSummary from './utils/getSummary.js'

interface Obj{
    data:{
        body:string
    }
}

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get("/:threadId",async (req:Request,res:Response) =>{
    try{
        const {threadId} = req.params
        
        console.log("in get route")
        const response = await fetch(`https://www.reddit.com/comments/${threadId}.json`)
        const data = await response.json()
        // console.log(data[1].data.children)
        const title =data[0].data.children[0].data.title
        // console.log(title)
        const comments = data[1].data.children.map((obj:Obj) => obj.data.body)
        // console.log(comments)
        const summary = await getSummary(title,comments)
        res.status(200).json({summary:summary})
    }
    catch(e){
        console.log(e)
        res.status(500)
    }
})

app.listen(PORT,() =>{
    console.log("listening on port 3000")
})