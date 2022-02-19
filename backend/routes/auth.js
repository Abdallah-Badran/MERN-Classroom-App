import express from 'express'
import authCtrl from '../controllers/auth.js'

const router = express.Router()

// POST request to authenticate the user with their email and password
router.route('/auth/signin')
    .post(authCtrl.signin)

// GET request to clear the cookie containing a JWT that was set on the response object after sign -in
router.route('/auth/signout')
    .get(authCtrl.signout)

export default router