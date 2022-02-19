import app from "./app.js"
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.DB_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("DB and Server are running")
    })
}).catch((err) => { console.log(err.message) })