import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import dotenv from 'dotenv'
dotenv.config()

const signin = async (req, res) => {
    try {
        let user = await User.findOne({
            "email": req.body.email
        })
        if (!user)
            return res.status('401').json({
                error: "User not found"
            })

        if (!user.authenticate(req.body.password)) {
            return res.status('401').send({
                error: "Email and password don't match."
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET)

        /* The signed JWT is returned to the authenticated client, along with the user's details. Optionally, we can
         also set the token to a cookie in the response object so that it is available to the client-side if cookies
         are the chosen form of JWT storage. On the client-side, this token must be attached as an Authorization
         header when requesting protected routes from the server. To sign-out a user, the client-side can simply
         delete this token depending on how it is being stored. A signout API endpoint is used to clear the cookie
         containing the token. .*/
        res.cookie("t", token, {
            expire: new Date() + 9999
        })

        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                educator: user.educator
            }
        })

    } catch (err) {

        return res.status('401').json({
            error: "Could not sign in"
        })

    }
}

/* The signout function clears the response cookie containing the signed JWT. This is an optional endpoint and not
 really necessary for auth purposes if cookies are not used at all in the frontend.*/
const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ['HS256']
})


// authorization is to make sure the requesting user is only updating or deleting their own user information.
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {
    signin,
    signout,
    requireSignin,
    hasAuthorization
}