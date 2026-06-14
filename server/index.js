import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 8000

app.get("/", (req, res) => {
    return res.json({ message: " server started " })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})