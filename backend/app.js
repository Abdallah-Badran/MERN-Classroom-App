import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'
import courseRouter from './routes/course.js'
import enrollmentRouter from './routes/enrollment.js'


const app = express()

app.use(cors())
app.use(express.json())


app.use('/', userRouter)
app.use('/', authRouter)
app.use('/', courseRouter)
app.use('/', enrollmentRouter)

// To handle auth-related errors thrown by express-jwt when it tries to validate JWT tokens in incoming requests
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message }) // returned :  "error": "UnauthorizedError: No authorization token was found"
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err)
    }
})

export default app 