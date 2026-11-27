import express, { type Request, type Response } from "express"

const app = express()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    console.log(res)
    res.status(200).json({
        success: true,
        message: "Server running successfully!!!",
        Author:"junaied!!!"
        
    })
})


export default app;